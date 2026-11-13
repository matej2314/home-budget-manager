import { runController } from '../utils/http/runController.js';
import { extractReceiptTotal } from '../services/receipt/extractReceiptTotal.js';

export async function extractReceipt(req, res) {
  return runController(res, async () => {
    const result = await extractReceiptTotal(req.file?.buffer);
    if (req.file) req.file.buffer = null;
    return result;
  });
}
