const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("product.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);

const productPackage = grpcObject.productPackage;

const products = [
    {
        id: 1,
        name: "Samsung",
        price: 3000,
        category: "Smartphones",
        description: "A stunning phone case",
    },
    {
        id: 2,
        name: "Samsung",
        price: 3000,
        category: "Smartphones",
        description: "A stunning phone case",
    },
    {
        id: 3,
        name: "Samsung",
        price: 3000,
        category: "Smartphones",
        description: "A stunning phone case",
    }
];

// const productSample = {
//     id: 1,
//     name: "Samsung",
//     price: 3000,
//     category: "Smartphones",
//     description: "A stunning phone case",
// };

function createProduct(call, callback) {
    const data = call.request; 

    const newProductData = { ...data, id: products.length + 1, new: false };

    products.push(newProductData);

    console.log("Sent Product is => ", newProductData);
    callback(null, newProductData);
}

function readProduct(call, callback){
    const productId = call.request.id;
    const selectedProduct = products.find(product => product.id === productId);

    console.log("selectedProduct is => ", selectedProduct);

    if(selectedProduct){
        callback(null, selectedProduct);
    }else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Could not find a product with the specified ID"
        });
    }
}

function readProducts(call, callback){
    callback(null, { products });
}

function updateProduct(call, callback){
    const productInfo = call.request;

    const productIndex = products.findIndex(product => product.id === productInfo.id);
    if(!productIndex){
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Could not find a product with the specified ID to update"
        });
    }

    const selectedProduct = products[productIndex];

    const updatedProduct = {
        id: selectedProduct.id,
        name: productInfo.name ? productInfo.name : selectedProduct.name,
        description: productInfo.description ? productInfo.description : selectedProduct.description,
        price: productInfo.price ? productInfo.price : selectedProduct.price,
        category: productInfo.category ? productInfo.category : selectedProduct.category,
    }

    products.splice(productIndex, 1, updatedProduct);
    
    callback(null, updatedProduct);
}

function deleteProduct(call, callback){
    const productId = call.request.id;
    const productIndex = products.findIndex(product => product.id === productId);
    if(!productIndex){
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Could not find a product with the specified ID to delete"
        });
    }

    products.splice(productIndex, 1);

    callback(null, { deleted: true });
}


(function(){
    const server = new grpc.Server();
    server.addService(productPackage.Todo.service, {
        createProduct,
        readProduct,
        readProducts,
        updateProduct,
        deleteProduct,
    });

    server.bindAsync("0.0.0.0:5000", grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
})();