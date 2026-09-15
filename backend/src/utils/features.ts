import dns from "node:dns";
import mongoose from "mongoose";

// Resolve querySrv ECONNREFUSED issue by using public DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "Ecommerce_24",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};
