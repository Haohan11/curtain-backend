import users from "@/mockdata/users";

const GetAllProducts = (req, res) => {
  const total = users.data.length;
  const size = parseInt(req.query.size) || 1;
  const totalPages = total % size === 0 ? total / size : Math.floor(total / size  + 1);
  const page = parseInt(req.query.page);
  const start = parseInt(req.query.start) || 0;

  const begin = page ? (page - 1) * size : start;

  if (req.method !== "GET")
    return res.status(404).json({ message: "resource not found" });

  return res.status(200).json({
    start,
    size,
    begin,
    total,
    totalPages,
    data: users.data.slice(begin, begin + size),
  });
};

export default GetAllProducts;
