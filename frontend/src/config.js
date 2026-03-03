const CONFIG = {
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://flatcms-grav-api.azurewebsites.net/api' // Reemplaza con tu URL real de producción (Azure, Heroku, etc.)
      : 'http://localhost:3001/api'
};

export default CONFIG;
