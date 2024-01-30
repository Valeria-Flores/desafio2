let id = 0;
const fs = require("fs")
class ProductManager{
    constructor(){
       this.products=[];
       this.sumId = 1;
       this.path = "./products"
    }
    // métodos
    addProduct(title, description, price, thumbnail, code, stock){
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("Error: favor de llenar todos los campos");
            return;
        }
        if(this.products.some(product => product.code === code)){
            console.log("Error: el código ", code, " ya se encuentra registrado.")
            return;
        }
        const newProduct = {
            id: this.sumId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(newProduct);
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data, 'utf8');
    }
    
    getProducts(){
        return fs.readFileSync(this.path, "utf-8");
    }

    getProductById(id){
        const productsData = this.getProducts();
        const products = JSON.parse(productsData);
        const foundProduct = products.find((p) => p.id === id);
        if(foundProduct){
            return foundProduct;
        }
        else{
            console.log("Producto no encontrado")
            return null
        }        
    }
    updateProduct(id, value){
        const productsData = this.getProducts();
        const productID = JSON.parse(productsData);
        const index = productID.findIndex((p) => p.id === id);

        if(productID== null){
            return "Error: producto no encontrado"
        }
        else{
            productID[index] = { ...productID[index], ...value };
            const updatedData = JSON.stringify(productID, null, 2);
            fs.writeFileSync(this.path, updatedData, 'utf8');
        }
    }
    deleteProduct(id) {
        const productsData = this.getProducts();
        const products = JSON.parse(productsData);
        products.splice((p) => p.id !== id,1);
        const updatedData = JSON.stringify(products, null, 2);
        fs.writeFileSync(this.path, updatedData, 'utf8');
    }
}

// Ejemplo de uso
const productManager = new ProductManager();
console.log(productManager.getProducts()); // Arreglo vacío

productManager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25); 
console.log(productManager.getProducts()); // Producto prueba

productManager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25); // Codigo registrado

productManager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "nfg345"); // Campo vacio


console.log(productManager.getProductById(50)) // Producto no encontrado
console.log(productManager.getProductById(1)) // Producto prueba

const updatedProductData = {
    "title": "Producto prueba",
    "description": "Este es un producto prueba",
    "price": 900,
    "thumbnail": "Sin imagen",
    "code": "abc123",
    "stock": 25
};
productManager.updateProduct(1,updatedProductData) 
console.log(productManager.getProducts()); // Precio: 900
productManager.deleteProduct(1)
console.log("Producto eliminado:",productManager.getProducts()); // Arreglo vacío

