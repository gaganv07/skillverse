export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

export const errorHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Email already exists"
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error"
  });
};
