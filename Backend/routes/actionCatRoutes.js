const express = require('express');
const router = express.Router();
const actionCatController = require('../controllers/actionCatController');
const verifyRole = require('../middlewares/verifyRole');
const verifyJWT = require('../middlewares/verifyJWT');

/**
 * @swagger
 * /actioncat/new:
 *   post:
 *     summary: Add a new transaction category
 *     description: This endpoint allows a user to add a new transaction category in the database. A valid type and name are required.
 *     tags:
 *       - Transaction categories
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *                 example: bills
 *               type:
 *                 type: string
 *                 description: Fitted transaction type to this category
 *                 example: income
 *     responses:
 *       200:
 *         description: Transaction category added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                   example: Kategoria transakcji bills dodana poprawnie.
 *       400:
 *         description: Missing or invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Brak danych do dodania kategorii transakcji.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Error description
 *                   example: Błąd dodawania nowej kategorii transakcji.
 */

router.post('/new', verifyJWT, verifyRole('superadmin'), actionCatController.addNewActionCat);

/**
 * @swagger
 * /actioncat/collection:
 *   get:
 *     summary: Pobierz wszystkie kategorie transakcji.
 *     description: Zwraca listę wszystkich kategorii transakcji. Kategorie posortowane są zgodnie z ID.
 *     tags:
 *       - Transaction categories
 *     responses:
 *       200:
 *         description: Kategorie transakcji pobrane poprawnie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie.
 *                   example: Kategorie transakcji pobrane poprawnie.
 *                 actionCategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unikalny identyfikator kategorii.
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       name:
 *                         type: string
 *                         description: Nazwa kategorii.
 *                         example: bills
 *                       type:
 *                         type: string
 *                         description: Typ transakcji, do której pasuje.
 *                         example: income
 *       404:
 *         description: Brak kategorii w systemie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Wiadomość o braku danych.
 *                   example: Nie znaleziono kategorii transakcji.
 *       500:
 *         description: Wewnętrzny błąd serwera.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: Wystąpił błąd podczas przetwarzania żądania.
 */

router.get('/collection', verifyJWT, verifyRole('superadmin'), actionCatController.actionCatCollection);

/**
 * @swagger
 * /actioncat/delete:
 *   delete:
 *     summary: Usuń kategorię transakcji
 *     description: Usuwa wskazaną kategorię transakcji z bazy danych. Działanie dostępne tylko dla użytkownika superadmin.
 *     tags:
 *       - Transaction categories
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catName:
 *                 type: string
 *                 description: Nazwa kategorii do usunięcia
 *                 example: bills
 *     responses:
 *       200:
 *         description: Kategoria transakcji usunięta pomyślnie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie
 *                   example: Kategoria transakcji bills usunięta poprawnie.
 *       400:
 *         description: Brak wymaganych danych do usunięcia kategorii
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Opis błędu
 *                   example: Podaj poprawne dane dotyczące kategorii.
 *       403:
 *         description: Brak uprawnień do usunięcia kategorii
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Opis błędu
 *                   example: Brak uprawnień do usunięcia kategorii.
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Opis błędu
 *                   example: Nie udało się usunąć kategorii.
 */

router.delete('/delete', verifyJWT, verifyRole('superadmin'), actionCatController.deleteActionCat);

module.exports = router;
