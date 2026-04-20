const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'Rol no disponible',
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
      });
    }

    next();
  };
};

module.exports = roleMiddleware;