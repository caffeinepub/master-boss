# Máster Boss

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing page con branding Máster Boss
- Sistema de autenticación con roles: admin y usuario
- Panel admin: crear, editar y eliminar oportunidades de ingresos (título, descripción, tipo, monto estimado, requisitos, estado activo/inactivo)
- Panel usuario: ver listado de oportunidades activas, ver detalle, postularse a una oportunidad
- Gestión de postulaciones: el admin puede ver quién se postuló y cambiar el estado (pendiente, aprobado, rechazado)
- Dashboard de usuario: ver mis postulaciones y su estado
- Categorías de oportunidades: freelance, ventas, servicios, digital, otros

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: entidades Opportunity y Application con CRUD completo
2. Backend: roles admin/user via authorization component
3. Backend: funciones para postularse, ver postulaciones propias, gestionar estados
4. Frontend: landing page con hero, listado de oportunidades destacadas, CTA de registro
5. Frontend: panel admin con tabla de oportunidades y postulaciones
6. Frontend: panel usuario con listado de oportunidades y mis postulaciones
7. Frontend: formulario de postulación por oportunidad
