function index(req, res) {
  res.json({
    message: "Puppies for Days!",
    documentation_url: "",
    base_url: "",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
}



module.exports.index = index;