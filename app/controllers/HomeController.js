class HomeController {
  index(req, res) {
    res.send('Howdy from HomeController!');
  }

  test(req, res) {
    res.send(`Howdy! ${req.params.id}`);
  }
}

module.exports = HomeController;