export const loggerController = (req, res, next) => {
 try {
  req.logger.debug("Debug log");
  req.logger.http("Http log");
  req.logger.info("Info log");
  req.logger.warn("Warn log");
  req.logger.error("Error log");
  req.logger.fatal("Fatal log");
  res.setHeader("Content-Type", "application/json");

  return res.status(200).json({ payload: "Logs ejecutados" });
 } catch (error) {
  req.logger.fatal(`Error en el controller logger, función loggerController: ${error.message}`);
  next(error);
 }
};