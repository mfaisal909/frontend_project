import axios from "axios";
import { server } from "../server";

const OBJECT_ID = /^[0-9a-f]{24}$/i;

const isObjectId = (value) =>
  typeof value === "string" && OBJECT_ID.test(value);

// A product from the API carries the Mongo id of the shop that owns it, while a
// bundled demo listing only ships a numeric `shop.id` that names no account, so
// it can never be a conversation member. The server keeps one activated seller
// standing in for those demo listings, so every product page still has somebody
// to message. Resolves to `null` when no shop account exists at all; a server
// that cannot be reached throws, so the caller can report the real failure.
export const resolveSellerId = async (product) => {
  const raw = product?.shop?._id ?? product?.shopId ?? null;

  if (isObjectId(raw)) return raw;

  try {
    const { data } = await axios.get(`${server}/conversation/default-seller`, {
      withCredentials: true,
    });

    return isObjectId(data?.sellerId) ? data.sellerId : null;
  } catch (error) {
    if (error?.response?.status === 404) {
      // The server answered "no shop account yet"; there is no member to
      // start a thread with.
      return null;
    }

    throw error;
  }
};
