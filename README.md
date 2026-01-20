# 📋 Project Manager - Aplicación de Gestión de Proyectos

Una aplicación tipo Trello para gestionar proyectos con drag & drop, múltiples tableros y colaboración en tiempo real.

## 🚀 Características

- ✅ **Drag & Drop**: Arrastra y suelta tareas entre columnas
- 📊 **Múltiples Tableros**: Crea y gestiona varios tableros de proyectos
- 👥 **Colaboración en Tiempo Real**: Sincronización automática con Firebase
- 🔐 **Autenticación**: Login, registro y modo invitado
- 📱 **Responsive**: Funciona perfectamente en móviles y tablets
- 🎨 **Diseño Moderno**: Interfaz limpia y fácil de usar

## 🛠️ Stack Tecnológico

- **React** - Framework de UI
- **React DnD** - Drag and Drop
- **Zustand** - Gestión de estado
- **Firebase** - Backend (Auth + Firestore)
- **Vite** - Build tool

## 📦 Instalación

1. Clona o descarga el proyecto
2. Instala las dependencias:
```bash
npm install
```

3. Configura Firebase:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Authentication (Email/Password y Anonymous)
   - Crea una base de datos Firestore
   - Copia tu configuración de Firebase
   - Edita `src/firebase/config.js` y pega tu configuración

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🔧 Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication**:
   - Ve a Authentication > Sign-in method
   - Habilita "Email/Password"
   - Habilita "Anonymous"
4. Crea una base de datos **Firestore**:
   - Ve a Firestore Database
   - Crea la base de datos en modo de prueba
   - Configura las reglas de seguridad (ver abajo)
5. Obtén tu configuración:
   - Ve a Project Settings > General
   - En "Your apps", selecciona la web (</>)
   - Copia el objeto `firebaseConfig`
   - Pégalo en `src/firebase/config.js`

### Reglas de Firestore (Seguridad)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boards/{boardId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.uid in resource.data.members);
    }
  }
}
```

## 📝 Uso

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Crear Tablero**: Haz clic en "Crear nuevo tablero"
3. **Agregar Tareas**: Haz clic en "+ Agregar tarea" en cualquier columna
4. **Mover Tareas**: Arrastra y suelta tareas entre columnas
5. **Editar Tareas**: Haz clic en una tarea para editarla
6. **Eliminar**: Usa los botones de eliminar en tareas y tableros

## 🎨 Personalización

Puedes personalizar los colores de los tableros al crearlos, y modificar los estilos en los archivos CSS.

## 📱 Responsive

La aplicación está completamente optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🐛 Solución de Problemas

- **Error de Firebase**: Asegúrate de haber configurado correctamente `src/firebase/config.js`
- **No se cargan los tableros**: Verifica las reglas de seguridad de Firestore
- **Drag & Drop no funciona**: Asegúrate de que React DnD esté correctamente instalado

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

---

Hecho con ❤️ para aprender React y Firebase
