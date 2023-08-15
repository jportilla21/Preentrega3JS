
    const Producto = function (linea, precio, stock){
      this.linea = linea;
      this.precio = precio;
      this.stock = stock;
    }

    function verificarLineaExistente(lineas, lineaDeseada) {
      return lineas.some(producto => producto.linea.toUpperCase() === lineaDeseada.toUpperCase());
    }

    function verificarStockDisponible(lineas, lineaDeseada) {
      let lineaEncontrada = lineas.find(producto => producto.linea.toUpperCase() === lineaDeseada.toUpperCase());

      if (lineaEncontrada && lineaEncontrada.stock > 0) {
        return lineaEncontrada.stock;
      } else {
        return 0;
      }
    }

    function sacarValor (cantidad, valorUnitario) {
      return cantidad * valorUnitario;
    }

    let Producto1 = new Producto ("ENERGIA", 32000, 0);
    let Producto2 = new Producto ("LECHE", 34000, 300);
    let Producto3 = new Producto ("PROTEINA", 36000, 400);
    let Producto4 = new Producto ("PORCINOS", 39000, 50);

    let lineas = [Producto1, Producto2, Producto3, Producto4];

    function ActualizarLineas() {
      const lineaSelect = document.getElementById("lineaSelect");
      lineaSelect.innerHTML = ""; 

      for (const producto of lineas) {
        const option = document.createElement("option");
        option.value = producto.linea.toUpperCase();
        option.textContent = producto.linea;
        lineaSelect.appendChild(option);
      }
    }

    document.getElementById("verificarButton").addEventListener("click", function () {
      const lineaDeseada = document.getElementById("lineaSelect").value;
      const cantidadComprar = parseInt(prompt(`Cuántos bultos quieres comprar?`));

      if (!verificarLineaExistente(lineas, lineaDeseada)) {
        alert("Lo sentimos, la línea deseada no existe. Por favor escoja entre Energía, Leche, Proteína o Porcinos");
      } else {
        const stockDisponible = verificarStockDisponible(lineas, lineaDeseada);
  
        if (stockDisponible === 0) {
          Swal.fire("Error", "No hay stock disponible para la línea deseada.", "error");
        } else if (cantidadComprar > stockDisponible) {
          Swal.fire("Error", "No es posible hacer la venta. La cantidad a comprar es mayor que el stock disponible.", "error");
        } else {
          let lineaEncontrada = lineas.find(producto => producto.linea.toUpperCase() === lineaDeseada.toUpperCase());
          let totalAPagar = sacarValor(cantidadComprar, lineaEncontrada.precio);
          Swal.fire("Venta exitosa", `Total a pagar: $${totalAPagar}`, "success");
          guardarVenta(lineaDeseada, cantidadComprar, totalAPagar);
        }
      }
    });

    document.getElementById("agregarProductoButton").addEventListener("click", function () {
      Swal.mixin({
        input: 'text',
        confirmButtonText: 'Siguiente &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2', '3']
      }).queue([
        {
          title: 'Ingrese el nombre de la nueva línea:',
          text: 'Ejemplo: POLLOS, GATOS, PERROS, ETC'
        },
        {
          title: 'Ingrese el precio unitario de la nueva línea:',
          text: 'Ejemplo: 10000'
        },
        {
          title: 'Ingrese el stock inicial de la nueva línea:',
          text: 'Ejemplo: 50'
        }
      ]).then((result) => { 
        if (result.value) {
          const nuevaLinea = result.value[0];
          const nuevoPrecio = parseInt(result.value[1]);
          const nuevoStock = parseInt(result.value[2]);

          const nuevoProducto = new Producto(nuevaLinea.toUpperCase(), nuevoPrecio, nuevoStock);
          lineas.push(nuevoProducto);
          ActualizarLineas();
          Swal.fire("Éxito", `Producto "${nuevaLinea}" agregado con éxito.`, "success");
        }
      });
    });

    function guardarVenta(linea, cantidad, total) {
      const venta = { linea: linea, cantidad: cantidad, total: total };
      let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
      ventas.push(venta);
      localStorage.setItem("ventas", JSON.stringify(ventas));
    }

    ActualizarLineas();
  