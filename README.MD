INDICE:
Linea 5: Primera pre entrega.
Linea 47: Segunda pre entrega
Linea 106: Login por formulario

### /-------------------------------------------------------------IMPORTANTE-------------------------------------------------/

TO START: npm run dev
Base de datos: Mongo de manera local
nombre de la base de datos: 'ecommerce'
colecciones: 'carts', 'messages', 'products', 'sessions', 'usuarios'

### /------------------------------------------------------PRIMERA PRE ENTREGA--------------------------------------------/

¿Cómo usar?

La base de datos la implemente en un servidor local para poder realizar las pruebas sin necesidad de una acceder a una cuenta o contraseña.
Para empezar a usar las peticiones se puede hacer de 2 formas distintas. En DAO vienen implementadas los managers vía FS y Mongo, el archivo unicamente utiliza mongo aunque FS sigue implementado.

Postman/endpoints:

views:

localhost:8080/home

unicamente muestra los productos que ya están guardados en la base de datos, esta no funciona en tiempo real.

localhost:8080/realtimeproducts

En este endpoint se pueden eliminar y agregar productos en tiempo real, llenando el formulario de arriba para agregar productos y el de abajo para eliminarlos.
El de abajo utiliza las ID de mongo (que vienen en la página para facilidad a la hora de hacer las pruebas). imagen del producto unicamente acepta URL para uso de las imagenes.

localhost:8080/chats

Es un chat en el cual puedes colocar un nombre (el que sea) y poder conversar desde otro cliente contigo mismo (para experimentar la esquizofrenia). La base de datos guarda el nombre con el que te registraste y va agregando en la base de datos los mensajes que hayas escrito.

POST: localhost:8080/api/carts

Cuando se posiciona en este endpoint genera un cart automaticamente con un ID creado por mongo, cada ves que lanza una peticion de post desde postman.

PUT localhost:8080/api/carts/IDMONGODELCARRITO/product/CLAVEDELPRODUCTO

Revisa si el carrito tiene un producto con el ID generado, si no lo tiene, lo agrega, y en caso de que ya lo tenga, simplemente suma en 1 su valor. De momento no está implementado con los ID products de la base de datos, así que se podría agregar cualquier producto este o no en la base de datos.

DELETE: localhost:8080/api/carts/IDMONGOCARRITO

Elimina un carrito completo

### /----------------------------------------------------------------SEGUNDA PRE ENTREGA-----------------------------------------------------------/

TODAS LAS URL ESCUCHAN EN localhost:8080
Sé que que me faltan rutas y que tengo rutas demás, eso lo iré cambiando con el paso del tiempo.

/GET de productos

URL: /api/products
Permite visualizar todos los productos de la base de datos, con su respectiva pagina, también acepta req.query tales como

?limit[Number]: Establece un limite de documentos para visualizar.
?page[Number]: Indica la página en la que se está actualmente.
?status[Boolean]: Si el status es true, retorna todos los productos con disponibilidad en true, si es false, retorna los productos con disponibilidad en false
?category[String]: Permite buscar los productos por categoria, tales como CPU, GPU, RAM, etc...
?sort[String/Number]: Ordena los productos según el precio, "asc" o 1 para orden ascendente, "desc" o -1 para descendente.

Todos son concatenables entre si y no deberían presentar fallo alguno

/DELETE de carrito

URL: api/carts/:cid/products/:pid
Elimina del carrito el producto seleccionado. Recibe ID's de mongo como parametros

/PUT de carrito

URL: api/carts/:cid
Recibe un array de objetos por body y actualiza el carrito pasado por req.params según el ID del carrito. el array tiene el siguiente formato:

Lo que esta entre comillas no se cambia.
[
{"product": IDMONGO, "qty": Numero},
{"product": IDMONGO, "qty": Numero},
{"product": IDMONGO, "qty": Numero},
]

URL: api/carts/:cid/products/:pid
Actualiza unicamente la cantidad pasada por el body del producto en el carrito especificado por params.
FORMATO:
{"qty": Numero}

/DELETE de los productos del carrito

URL: api/carts/:cid
Elimina todos los productos del carrito especificado.

/GET de los carritos

URL: api/carts/:cid
Visualización del contenido del carrito con populate del producto

/VIEWS de los productos

URL: views/products

Visualiza una lista de productos con el titulo y la imagen (Si tiene una) y si se le da click al nombre del producto, te dirige a otra página dónde se despliega más información del producto y aparece el botón de agregar al carrito (De momento no hace nada más que mostrar un console.log con el ID del producto.)

### /----------------------------------------------------------------DESAFIO ENTREGABLE: Login por formulario.-----------------------------------------------------------/

Rutas:

GET /views/session

Es una vista principal que si estás logueado te deja ver tu perfil y te permite cerrar sesión, en caso de que no estés logueado, te mostrará unos enlaces de redirección para login y registro.

GET /views/session/login

Te deja loguearte en el servidor, en caso de que seas adminCoder@coder.com (está validado el correo más no la contraseña) te mostrará en products que si eres admin, en caso de que seas cualquier otro usuario registrado, te dará el rol de user. Una vez logueado, te redirige a productos. Si el logueo no fue éxitoso, te redirigirá a la misma web de login para que te loguees de manera correcta.

GET /views/session/register

Te permite registrarte en la página y una ves que te registres, te redirige al login, para que inicies sesión en la página.

GET /views/products

No muestra nada si el usuario no está logueado te redirige a el inicio de sesion, y una ves adentro, te permite cerrar sesión.

### /--------------------------------------------------------------------------Refactor de login---------------------------------------------------------------------------/

Al registrarte mediante el formulario, generas una contraseña, que siendo revisada en la base de datos, se hashea, y te dirige automaticamente a la página de login cuando la cuenta fue creada correctamente, si no, la página se mantiene en la página del registro para que lo intentes nuevamente.

Si el logueo es exitoso, te dirige a la página de products, si no, se queda en la página de login para que lo intentes nuevamente.

Al registrarte con github, toma los nombres del perfil y el email que este en el perfil (tiene que estar publico el email en el perfil) y los registra en la base de datos
Al hacer login mediante github, si todo sale bien, te dirige a la página de los productos.
