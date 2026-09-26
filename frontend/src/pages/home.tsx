import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { toast } from "react-hot-toast";
import { Skeleton } from "../components/admin/Loader";
import { useRef } from "react";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const addToCartHandler = () => {};
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const slide = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isError) {
    toast.error("cannot fetch the products");
  }

  return (
    <div className="home">
      <section></section>

      <h1>
        LATEST PRODUCTS
        <button className="leftArrow" onClick={() => slide("left")}>❮</button>
        <button className="rightArrow" onClick={() => slide("right")}>❯</button>
        <Link to={"/search"} className="findmore">
          MORE
        </Link>
      </h1>

            <main ref={sliderRef}>

        {isLoading ? (
          <Skeleton width="80vh " />
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
