const response = (res, statusCode, status, data, token) => {
  if (!res.length)
    return res.status(400).json({
      status: "Fail",
      message: "Data is empty",
    });
  return res.status(statusCode).json({
    status: status,
    data: data,
    token: token,
  });
};

module.exports = response;
