app.patch("/api/v1/tour/:id", (req, res) => {
  if (req.params.id * 1 > tour.length) {
    return res.status(404).json({
      status: "fatal",
      message: "user not updated",
    });
  }
  res.status(200).json({
    status: "sucess",
    message: "tour upadated successfully",
  });
});
app.delete("/api/v1/tour/:id", (req, res) => {
  if (req.params.id * 1 > tour.length) {
    return res.status(404).json({
      status: "fatal",
      message: "user not updated",
    });
  }
  res.status(204).json({
    status: "sucess",
    message: "null",
  });
});

//CREATING YOUR OWN MIDDLEWEAR

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
