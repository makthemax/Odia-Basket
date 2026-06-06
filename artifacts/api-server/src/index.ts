import app from "./app";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Image URL corrections — one-time fix for production
const CORRECT_IMAGE_URLS: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
  2: "https://upload.wikimedia.org/wikipedia/commons/b/be/Aesthetic_bunch_of_fenugreek_greens.jpg",
  3: "https://images.pexels.com/photos/2095569/pexels-photo-2095569.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  4: "https://images.pexels.com/photos/10329642/pexels-photo-10329642.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  5: "https://images.pexels.com/photos/4884808/pexels-photo-4884808.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  6: "https://images.pexels.com/photos/8243930/pexels-photo-8243930.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  7: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
  8: "https://images.pexels.com/photos/5502850/pexels-photo-5502850.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  9: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
  10: "https://images.pexels.com/photos/24783854/pexels-photo-24783854/free-photo-of-white-radish-on-display.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  11: "https://cdn.pixabay.com/photo/2015/08/21/15/50/onion-899095_640.jpg",
  12: "https://media.gettyimages.com/id/889592256/photo/green-bottle-gourds-on-vine-calabash.jpg?s=612x612&w=0&k=20&c=Ij19Y1loWrKx7_fEsEBs9_ZR-eBIksc9XZOL9e0j_UU=",
  13: "https://toptropicals.com/pics/garden/05/6/6548.jpg",
  14: "https://cdn.pixabay.com/photo/2021/08/09/21/49/bitter-gourd-6534408_640.jpg",
  15: "https://seedvilleusa.com/cdn/shop/files/shutterstock_2575089015.jpg?v=1747499211&width=1445",
  16: "https://indiagardening.com/wp-content/uploads/2020/05/2Pointed-Gourd.jpg",
  17: "https://images.pexels.com/photos/2006333/pexels-photo-2006333.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  18: "https://images.pexels.com/photos/5501465/pexels-photo-5501465.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  19: "https://www.freshaisle.com/cdn/shop/products/fresh-capsicum-green-200-350-gm-exotic-vegetables-743_266x266.jpg?v=1624199971",
  20: "https://images.pexels.com/photos/7195210/pexels-photo-7195210.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  21: "https://images.pexels.com/photos/3004798/pexels-photo-3004798.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  22: "https://images.pexels.com/photos/7288774/pexels-photo-7288774.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  23: "https://images.pexels.com/photos/768093/pexels-photo-768093.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  24: "https://images.pexels.com/photos/3671651/pexels-photo-3671651.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  25: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/08/raw-banana-plantain-swasthis.jpg",
  26: "https://cdn.create.vista.com/api/media/small/544592012/stock-photo-moringa-closeup-shot-some-peeled-pieces-drumsticks-drumsticks-moringa-healthy",
  27: "https://freshleafuae.com/wp-content/uploads/2024/08/jackfruit-green-freshleaf-dubai-uae-img02.jpg",
  28: "https://specialtyproduce.com/sppics/3409.png",
  30: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400",
  31: "https://images.pexels.com/photos/1423014/pexels-photo-1423014.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  32: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
  33: "https://upload.wikimedia.org/wikipedia/commons/b/be/Aesthetic_bunch_of_fenugreek_greens.jpg",
  34: "https://images.pexels.com/photos/2095569/pexels-photo-2095569.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  35: "https://images.pexels.com/photos/10329642/pexels-photo-10329642.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  36: "https://images.pexels.com/photos/4884808/pexels-photo-4884808.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  37: "https://images.pexels.com/photos/8243930/pexels-photo-8243930.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  38: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
  39: "https://images.pexels.com/photos/5502850/pexels-photo-5502850.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  40: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
  41: "https://images.pexels.com/photos/24783854/pexels-photo-24783854/free-photo-of-white-radish-on-display.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  42: "https://cdn.pixabay.com/photo/2015/08/21/15/50/onion-899095_640.jpg",
  43: "https://media.gettyimages.com/id/889592256/photo/green-bottle-gourds-on-vine-calabash.jpg?s=612x612&w=0&k=20&c=Ij19Y1loWrKx7_fEsEBs9_ZR-eBIksc9XZOL9e0j_UU=",
  44: "https://toptropicals.com/pics/garden/05/6/6548.jpg",
  45: "https://cdn.pixabay.com/photo/2021/08/09/21/49/bitter-gourd-6534408_640.jpg",
  46: "https://seedvilleusa.com/cdn/shop/files/shutterstock_2575089015.jpg?v=1747499211&width=1445",
  47: "https://indiagardening.com/wp-content/uploads/2020/05/2Pointed-Gourd.jpg",
  48: "https://images.pexels.com/photos/2006333/pexels-photo-2006333.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  49: "https://images.pexels.com/photos/5501465/pexels-photo-5501465.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  50: "https://www.freshaisle.com/cdn/shop/products/fresh-capsicum-green-200-350-gm-exotic-vegetables-743_266x266.jpg?v=1624199971",
  51: "https://images.pexels.com/photos/7195210/pexels-photo-7195210.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  52: "https://images.pexels.com/photos/3004798/pexels-photo-3004798.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  53: "https://images.pexels.com/photos/7288774/pexels-photo-7288774.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  54: "https://images.pexels.com/photos/768093/pexels-photo-768093.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  55: "https://images.pexels.com/photos/3671651/pexels-photo-3671651.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  56: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/08/raw-banana-plantain-swasthis.jpg",
  57: "https://cdn.create.vista.com/api/media/small/544592012/stock-photo-moringa-closeup-shot-some-peeled-pieces-drumsticks-drumsticks-moringa-healthy",
  58: "https://freshleafuae.com/wp-content/uploads/2024/08/jackfruit-green-freshleaf-dubai-uae-img02.jpg",
  59: "https://specialtyproduce.com/sppics/3409.png",
  60: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400",
  61: "https://images.pexels.com/photos/1423014/pexels-photo-1423014.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
};

async function fixImageUrls() {
  try {
    let updated = 0;
    for (const [idStr, url] of Object.entries(CORRECT_IMAGE_URLS)) {
      const id = Number(idStr);
      await db
        .update(productsTable)
        .set({ imageUrl: url })
        .where(eq(productsTable.id, id));
      updated++;
    }
    logger.info({ updated }, "Fixed product image URLs");
  } catch (err) {
    logger.error({ err }, "Failed to fix image URLs");
  }
}

app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  await fixImageUrls();
});
