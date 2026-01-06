const logger = (req, res, next) => {
  const { method, host, path } = req;
  const time = new Date().toLocaleTimeString("fr-FR");
  console.log(`${time} : ${method} - ${host} - ${path}`);
  console.log(
    `89e15558... : ${new Date(1766067227 * 1000)} -  ${new Date(
      1767998853 * 1000
    )}`
  );
  console.log(
    `a7ced671... : ${new Date(1766067227 * 1000)} -  ${new Date(
      1767449627 * 1000
    )}`
  );
  console.log(
    `b4bbc5c7... : ${new Date(1766067227 * 1000)} -  ${new Date(
      1766153627 * 1000
    )}`
  );
  console.log(
    `ce8cd45b... : ${new Date(1766067227 * 1000)} -  ${new Date(
      1767449627 * 1000
    )}`
  );
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 3);
  console.log(`Date now + 2 days : ${newDate} -  ${newDate.getTime() / 1000}`);
  next();
};
export default logger;
