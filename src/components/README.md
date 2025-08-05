# Componentes de Navegación

## BottomNavigationBar

Este componente maneja la navegación inferior de la aplicación con bifurcación automática basada en el rol del usuario.

### Funcionalidad

- **Bifurcación automática**: Detecta automáticamente si el usuario es `worker` o `user` (cliente)
- **Navegación directa**: Redirige directamente a la pantalla correcta sin pasar por el ProfileLoader
- **Indicadores visuales**: Muestra el estado activo de la pantalla actual
- **Fallback**: Si no se puede determinar el rol, usa el ProfileLoader como respaldo

### Uso

```tsx
import BottomNavigationBar from '../components/BottomNavigationBar';

// En cualquier pantalla
<BottomNavigationBar currentScreen="Home" />
```

### Props

- `currentScreen`: (opcional) El nombre de la pantalla actual para mostrar el estado activo

### Comportamiento

1. **Usuario Worker**: Al presionar el botón de perfil, navega directamente a `WorkerProfile`
2. **Usuario Cliente**: Al presionar el botón de perfil, navega directamente a `ClientProfile`
3. **Rol no determinado**: Usa el `ProfileLoader` como fallback

## Hook useUserRole

Hook personalizado que maneja la obtención del rol del usuario desde Firestore.

### Uso

```tsx
import { useUserRole } from '../hooks/useUserRole';

const { userRole, loading } = useUserRole();
```

### Retorna

- `userRole`: El rol del usuario ('user', 'worker', o null)
- `loading`: Estado de carga mientras se obtiene el rol

## ProfileLoader

Componente que actúa como intermediario para redirigir al usuario a la pantalla de perfil correcta.

### Funcionalidad

- Muestra un indicador de carga mientras determina el rol
- Redirige automáticamente a la pantalla correcta
- Maneja casos de error redirigiendo al login

### Flujo

1. Carga el rol del usuario desde Firestore
2. Muestra un ActivityIndicator durante la carga
3. Redirige a `ClientProfile` si es usuario
4. Redirige a `WorkerProfile` si es trabajador
5. Redirige a `Login` si hay error 