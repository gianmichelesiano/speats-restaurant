
-- Inserimento di dati nella tabella 'tenant'
INSERT INTO public.tenant (name, description) VALUES
('Ristorante Italiano', 'Ristorante con cucina tradizionale italiana.'),
('Ristorante Giapponese', 'Ristorante con specialità sushi e ramen.'),
('Ristorante Messicano', 'Ristorante con cucina tex-mex.');

-- Inserimento di dati nella tabella 'restaurants'
INSERT INTO public.restaurants (tenant_id, name, address, phone, opening_hours, logo_image, description) VALUES
((SELECT id FROM public.tenant WHERE name = 'Ristorante Italiano'), 'Trattoria da Luigi', 'Via Roma 1, Milano', '+39 02 1234567', '12:00-15:00, 19:00-23:00', 'https://example.com/logo_italiano.png', 'Trattoria a conduzione familiare con piatti tipici italiani.'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Giapponese'), 'Sushi Zen', 'Via Verdi 5, Roma', '+39 06 9876543', '18:00-24:00', 'https://example.com/logo_giapponese.png', 'Ristorante giapponese con sushi fresco e ramen fatti in casa.'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Messicano'), 'Tacos El Mariachi', 'Via Napoli 10, Firenze', '+39 055 5678901', '19:00-01:00', 'https://example.com/logo_messicano.png', 'Ristorante messicano con tacos, burritos e margarita.');

-- Inserimento di dati nella tabella 'customers'
INSERT INTO public.customers (tenant_id, first_name, last_name, email, phone) VALUES
((SELECT id FROM public.tenant WHERE name = 'Ristorante Italiano'), 'Mario', 'Rossi', 'mario.rossi@email.com', '+39 333 1234567'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Giapponese'), 'Yuki', 'Tanaka', 'yuki.tanaka@email.com', '+39 333 9876543'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Messicano'), 'Carlos', 'Garcia', 'carlos.garcia@email.com', '+39 333 5678901');

-- Inserimento di dati nella tabella 'tables'
INSERT INTO public.tables (tenant_id, restaurant_id, table_number, capacity, position) VALUES
((SELECT id FROM public.tenant WHERE name = 'Ristorante Italiano'), (SELECT id FROM public.restaurants WHERE name = 'Trattoria da Luigi'), 1, 4, 'Vicino alla finestra'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Giapponese'), (SELECT id FROM public.restaurants WHERE name = 'Sushi Zen'), 2, 2, 'Bancone sushi'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Messicano'), (SELECT id FROM public.restaurants WHERE name = 'Tacos El Mariachi'), 3, 6, 'Terrazza esterna');

-- Inserimento di dati nella tabella 'reservations'
INSERT INTO public.reservations (tenant_id, restaurant_id, table_id, customer_id, reservation_datetime, number_of_people, notes, status) VALUES
((SELECT id FROM public.tenant WHERE name = 'Ristorante Italiano'), (SELECT id FROM public.restaurants WHERE name = 'Trattoria da Luigi'), (SELECT id FROM public.tables WHERE table_number = 1), (SELECT id FROM public.customers WHERE first_name = 'Mario'), '2024-03-10 20:00:00', 4, 'Nessuna nota', 'Confermata'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Giapponese'), (SELECT id FROM public.restaurants WHERE name = 'Sushi Zen'), (SELECT id FROM public.tables WHERE table_number = 2), (SELECT id FROM public.customers WHERE first_name = 'Yuki'), '2024-03-11 21:00:00', 2, 'Richiesta di tavolo tranquillo', 'In attesa'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Messicano'), (SELECT id FROM public.restaurants WHERE name = 'Tacos El Mariachi'), (SELECT id FROM public.tables WHERE table_number = 3), (SELECT id FROM public.customers WHERE first_name = 'Carlos'), '2024-03-12 22:00:00', 6, 'Compleanno', 'Confermata');

-- Inserimento di dati nella tabella 'menu_items'
INSERT INTO public.menu_items (tenant_id, restaurant_id, name, description, price, image, category) VALUES
((SELECT id FROM public.tenant WHERE name = 'Ristorante Italiano'), (SELECT id FROM public.restaurants WHERE name = 'Trattoria da Luigi'), 'Pizza Margherita', 'Pizza con pomodoro, mozzarella e basilico.', 10.00, 'https://example.com/pizza.jpg', 'Primi'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Giapponese'), (SELECT id FROM public.restaurants WHERE name = 'Sushi Zen'), 'California Roll', 'Roll con avocado, cetriolo e surimi.', 12.00, 'https://example.com/california_roll.jpg', 'Sushi'),
((SELECT id FROM public.tenant WHERE name = 'Ristorante Messicano'), (SELECT id FROM public.restaurants WHERE name = 'Tacos El Mariachi'), 'Tacos al Pastor', 'Tacos con carne di maiale marinata e ananas.', 8.00, 'https://example.com/tacos.jpg', 'Antipasti');
