const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const logger = require('../configs/logger');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole.js');
const usersController = require('../controllers/usersController.js');

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Pobierz wszystkich uzytkowników aplikacji.
 *     description: Zwraca listę wszystkich użytkowników w bazie danych uporządkowaną według ID użytkownika.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista wszystkich użytkowników pobrana poprawnie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie
 *                   example: Lista wszystkich użytkowników pobrana poprawnie
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unikalny identyfikator użytkownika
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       role:
 *                         type: string
 *                         description: rola użytkownika w systemie
 *                         example: 'user'
 *                       name:
 *                         type: string
 *                         description: Login użytkownika w systemie
 *                         example: 'test1234'
 *                       password:
 *                         type: string
 *                         description: Zaszyfrowane hasło użytkownika
 *                         example: '$2b$10$Wbc/LzFDGB0quWuk6Fd2CusUdnUHrj9wDa7H4PkU1b4'
 *                       email:
 *                         type: string
 *                         description: Adres e-mail użytkownika.
 *                         example: 'email@email.pl'
 *                       household_id:
 *                         type: string
 *                         description: Id gospodarstwa domowego, którego użytkownika jest założycielem/właścicielem
 *                         example: 42bfc32f-0bd2-4aff-9ebd-6da002ea790e
 *                       inhabitant:
 *                         type: string
 *                         description: Jeżeli użytkownik jest tylko domownikiem, ID gospodarstwa, do którego należy.
 *                         example: 42bfc32f-0bd2-4aff-9ebd-6da002ea790e
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
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu
 *                   example: Błąd pobierania listy użytkowników.
 */

router.get('/all', verifyJWT(), usersController.getAllUsers);

/**
 * @swagger
 * /users/house:
 *   get:
 *     summary: Pobierz wszystkich uzytkowników, którzy przynależą do wskazanego gospodarstwa.
 *     description: Zwraca listę wszystkich domowników gospodarstwa uporządkowaną według ID użytkownika.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista wszystkich domowników wskazanego gospodarstwa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie
 *                   example: Lista domowników gospodarstwa 123e4567-e89b-12d3-a456-426614174000 pobrana poprawnie
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unikalny identyfikator użytkownika
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       role:
 *                         type: string
 *                         description: rola użytkownika w systemie
 *                         example: 'user'
 *                       name:
 *                         type: string
 *                         description: Login użytkownika w systemie
 *                         example: 'test1234'
 *                       email:
 *                         type: string
 *                         description: Adres e-mail użytkownika.
 *                         example: 'email@email.pl'
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
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu
 *                   example: Nie udało się pobrać listy domowników gospodarstwa.
 */

router.get('/house', verifyJWT(), usersController.getInhabitants);

/**
 * @swagger
 * /users/delete/{userId}:
 *   post:
 *     summary: Usuń użytkownika
 *     description: Usuwa użytkownika oraz przypisane do niego gospodarstwo (jeśli istnieje) z systemu.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID użytkownika do usunięcia.
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       description: Nie jest wymagane.
 *       required: false
 *     responses:
 *       200:
 *         description: Użytkownik i gospodarstwo usunięte pomyślnie.
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
 *                   example: Użytkownik usunięty poprawnie.
 *       403:
 *         description: Brak uprawnień do usunięcia użytkownika.
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
 *                   example: Nie masz uprawnień do usunięcia użytkownika.
 *       404:
 *         description: Użytkownik lub gospodarstwo nie zostało znalezione.
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
 *                   example: Nie znaleziono użytkownika lub gospodarstwa.
 *       500:
 *         description: Wystąpił błąd serwera podczas usuwania użytkownika lub gospodarstwa.
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
 *                   example: Błąd serwera.
 */


router.post('/delete/:userId', verifyJWT(), usersController.deleteUser);

/**
 * @swagger
 * /users/delete/inhabitant:
 *   delete:
 *     summary: Usuń domownika
 *     description: Usuwa domownika z gospodarstwa, jeśli użytkownik posiada odpowiednie uprawnienia.
 *     tags:
 *       - Inhabitants
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inhabitantId:
 *                 type: integer
 *                 description: ID domownika do usunięcia.
 *                 example: 456
 *     responses:
 *       200:
 *         description: Domownik został pomyślnie usunięty.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie.
 *                   example: 'Domownik 456 został usunięty poprawnie.'
 *       403:
 *         description: Użytkownik nie należy do gospodarstwa lub brak uprawnień.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: 'Nie masz uprawnień do usunięcia tego użytkownika.'
 *       404:
 *         description: Nie znaleziono użytkownika do usunięcia.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: 'Użytkownik nie jest domownikiem.'
 *       500:
 *         description: Wystąpił błąd serwera podczas usuwania użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: 'Nie udało się usunąć domownika.'
 */

router.delete('/delete/inhabitant', verifyJWT(), usersController.deleteInhabitant);


module.exports = router;