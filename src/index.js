import { connectDB } from "./db.js";
import app from "./app.js"; 

async function main() {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log(`Listening on port http://localhost:3000`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();