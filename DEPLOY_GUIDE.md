# Guía de Despliegue: VPS Hostinger

## Arquitectura
```
Internet → Nginx (80/443) → Next.js App (3000) → PostgreSQL (5432, interno)
```

## Requisitos del VPS
- Ubuntu 22.04 o 24.04
- Mínimo 2GB RAM, 2 vCPUs
- 20GB+ SSD
- Puerto 22 (SSH), 80 (HTTP), 443 (HTTPS) abiertos

---

## Paso 1: Configurar VPS en Hostinger

1. Compra VPS en Hostinger
2. Instala Ubuntu 22.04/24.04
3. Accede por SSH:
   ```bash
   ssh root@<IP_DEL_VPS>
   ```

---

## Paso 2: Instalar Docker y Docker Compose

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sh

# Agregar usuario actual al grupo docker
usermod -aG docker $USER

# Instalar Docker Compose plugin
apt install docker-compose-plugin -y

# Verificar instalación
docker --version
docker compose version
```

---

## Paso 3: Configurar SSH Key para GitHub Actions

### En tu PC local:
```bash
# Generar par de claves (si no tienes)
ssh-keygen -t ed25519 -C "github-actions@pixel"

# Copiar clave pública
cat ~/.ssh/id_ed25519.pub
```

### En el VPS:
```bash
# Crear usuario para deploy (opcional pero recomendado)
adduser deployer
usermod -aG docker deployer
usermod -aG sudo deployer

# Agregar clave pública al VPS
mkdir -p /home/deployer/.ssh
echo "<TU_CLAVE_PUBLICA>" >> /home/deployer/.ssh/authorized_keys
chown -R deployer:deployer /home/deployer/.ssh
chmod 700 /home/deployer/.ssh
chmod 600 /home/deployer/.ssh/authorized_keys
```

### En GitHub:
1. Ve a tu repo → Settings → Secrets and variables → Actions
2. Agrega estos secretos:
   - `VPS_HOST`: IP de tu VPS
   - `VPS_USER`: deployer (o root)
   - `VPS_SSH_KEY`: Contenido de `~/.ssh/id_ed25519` (clave privada)
   - `VPS_PORT`: 22

---

## Paso 4: Clonar el Repositorio en el VPS

```bash
# Como usuario deployer
su - deployer

# Clonar repo
git clone https://github.com/<TU_USUARIO>/pixel.git ~/pixel
cd ~/pixel
```

---

## Paso 5: Configurar Variables de Entorno

### Staging:
```bash
cp .env.staging .env.staging.local
# Editar si es necesario
nano .env.staging.local
```

### Producción:
```bash
# Generar contraseña segura para DB
openssl rand -base64 32

# Editar .env.production
nano .env.production
# Cambiar DB_PASSWORD por la generada
```

---

## Paso 6: Configurar SSL con Let's Encrypt

### Instalar Certbot:
```bash
apt install certbot -y
```

### Generar certificados:

#### Para producción:
```bash
sudo certbot certonly --standalone -d semillero-pixel.com -d www.semillero-pixel.com

# Copiar certificados a nginx
mkdir -p ~/pixel/nginx/ssl/prod
cp /etc/letsencrypt/live/semillero-pixel.com/fullchain.pem ~/pixel/nginx/ssl/prod/
cp /etc/letsencrypt/live/semillero-pixel.com/privkey.pem ~/pixel/nginx/ssl/prod/
```

#### Para staging:
```bash
sudo certbot certonly --standalone -d staging.semillero-pixel.com

mkdir -p ~/pixel/nginx/ssl/staging
cp /etc/letsencrypt/live/staging.semillero-pixel.com/fullchain.pem ~/pixel/nginx/ssl/staging/
cp /etc/letsencrypt/live/staging.semillero-pixel.com/privkey.pem ~/pixel/nginx/ssl/staging/
```

### Actualizar configs de nginx para usar SSL:

Después de obtener certificados, actualiza `nginx/prod.conf` y `nginx/staging.conf` para usar HTTPS (ya están configurados).

### Auto-renovar certificados:
```bash
# Agregar al crontab
crontab -e
# Agregar línea:
0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/semillero-pixel.com/fullchain.pem ~/pixel/nginx/ssl/prod/ && cp /etc/letsencrypt/live/semillero-pixel.com/privkey.pem ~/pixel/nginx/ssl/prod/ && docker compose -f docker-compose.prod.yml restart pixel-nginx
```

---

## Paso 7: Desplegar Manualmente (Primera Vez)

### Staging:
```bash
cd ~/pixel

# Levantar servicios
docker compose -f docker-compose.staging.yml up -d --build

# Ejecutar migraciones
docker compose -f docker-compose.staging.yml exec pixel-app npx prisma migrate deploy

# Ejecutar seed
docker compose -f docker-compose.staging.yml exec pixel-app npx prisma db seed
```

### Producción:
```bash
cd ~/pixel

# Levantar servicios
docker compose -f docker-compose.prod.yml up -d --build

# Ejecutar migraciones
docker compose -f docker-compose.prod.yml exec pixel-app npx prisma migrate deploy

# Ejecutar seed
docker compose -f docker-compose.prod.yml exec pixel-app npx prisma db seed
```

---

## Paso 8: Verificar Despliegue

```bash
# Ver contenedores corriendo
docker ps

# Ver logs
docker compose -f docker-compose.prod.yml logs -f pixel-app
docker compose -f docker-compose.staging.yml logs -f pixel-app

# Probar endpoints
curl -I http://localhost:3001  # Staging
curl -I http://localhost:3000  # Producción (interno)
```

---

## Flujo de Trabajo con GitHub Actions

### Desplegar a Staging:
```bash
git checkout develop
# Hacer cambios
git add .
git commit -m "feat: nueva funcionalidad"
git push origin develop
# GitHub Actions despliega automáticamente a staging
```

### Desplegar a Producción:
```bash
git checkout main
git merge develop
git push origin main
# GitHub Actions despliega automáticamente a producción
```

---

## Comandos Útiles

### Ver estado de servicios:
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.staging.yml ps
```

### Reiniciar servicios:
```bash
docker compose -f docker-compose.prod.yml restart
docker compose -f docker-compose.staging.yml restart
```

### Ver logs en tiempo real:
```bash
docker compose -f docker-compose.prod.yml logs -f
```

### Acceder a la base de datos:
```bash
docker exec -it pixel_prod_db psql -U postgres -d pixel_prod
```

### Backup de base de datos:
```bash
docker exec pixel_prod_db pg_dump -U postgres pixel_prod > backup_$(date +%Y%m%d).sql
```

### Restaurar backup:
```bash
cat backup_20240101.sql | docker exec -i pixel_prod_db psql -U postgres pixel_prod
```

---

## Troubleshooting

### Error: "Connection refused" a la base de datos
- Verifica que el contenedor de PostgreSQL esté corriendo: `docker ps`
- Verifica que `DATABASE_URL` use el nombre del servicio (`pixel-db`) no `localhost`

### Error: "Port already in use"
- Cambia los puertos en docker-compose.yml
- Verifica qué servicio usa el puerto: `sudo lsof -i :3000`

### Error: SSL no funciona
- Verifica que los certificados estén en la ruta correcta
- Verifica que nginx.conf apunte a los archivos correctos
- Reinicia nginx: `docker compose -f docker-compose.prod.yml restart pixel-nginx`

### GitHub Actions falla al conectar por SSH
- Verifica que los secretos estén configurados correctamente
- Verifica que la clave SSH tenga permisos correctos en el VPS
- Prueba conexión manual: `ssh -i ~/.ssh/id_ed25519 deployer@<IP>`

---

## Checklist Final

- [ ] VPS comprado y Ubuntu instalado
- [ ] Docker y Docker Compose instalados
- [ ] SSH key configurada para GitHub Actions
- [ ] Repositorio clonado en VPS
- [ ] Variables de entorno configuradas
- [ ] Certificados SSL obtenidos
- [ ] Staging desplegado y funcionando
- [ ] Producción desplegada y funcionando
- [ ] Dominio apuntando al VPS
- [ ] GitHub Actions funcionando (push a develop/main)
- [ ] Backup automático configurado
