import { Router } from 'express';
import { mobileCountryCodes, countries } from '../controllers/lookups.controller';

const router = Router();

router.get('/mobile-country-codes', mobileCountryCodes);
router.get('/countries', countries);

export default router;
