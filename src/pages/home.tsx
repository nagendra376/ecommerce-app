import { Link } from "react-router-dom";

const home = () => {
  return (
    <div className="home">
      <section></section>

      <h1>Latest Products</h1>

      <Link to="/search" className="findmore">
        more
      </Link>
    </div>
  );
};

export default home;
