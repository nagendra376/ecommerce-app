import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { toast } from "react-hot-toast";
import Loader from "../components/loader";
import { Skeleton } from "../components/admin/Loader";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const addToCartHandler = () => {};

  if (isError) {
    toast.error("cannot fetch the products");
  }

  return (
    <div className="home">
      <section></section>

      <h1>
        LATEST PRODUCTS
        <Link to={"/search"} className="findmore">
          MORE
        </Link>
      </h1>

      <main>
        {isLoading ? (
          <Skeleton width="80vh "/>
        ) : (
          data?.products.map((i) => {
            return (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photo={i.photo}
              />
            );
          })
        )}
      </main>
    </div>
  );
};

export default Home;
