import { runController } from '../utils/http/runController.js';
import { addReview } from '../services/shell/reviews/addReview.js';
import { getReviewsCollection } from '../services/shell/reviews/getReviewsCollection.js';

export async function addReviewHandler(req, res) {
  return runController(res, () =>
    addReview({
      userId: req.userId,
      userName: req.userName,
      content: req.body.content,
      rating: req.body.rating,
    }),
  );
}

export async function getReviewsCollectionHandler(req, res) {
  return runController(res, () => getReviewsCollection());
}

export {
  addReviewHandler as addReview,
  getReviewsCollectionHandler as getReviewsCollection,
};
