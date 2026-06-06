import { collection, getDocs, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { initialBooks } from "./initialBooks";

export const seedDatabase = async () => {
  try {
    const booksRef = collection(db, "libro");
    const booksSnapshot = await getDocs(booksRef);
    
    // Si ya hay libros, no hacemos el seed de nuevo
    if (!booksSnapshot.empty) {
      console.log("La base de datos ya tiene datos. Omitiendo seeding.");
      return;
    }

    console.log("Iniciando seeding de la base de datos...");
    const batch = writeBatch(db);
    
    // Extraer categorías y autores únicos
    const categoriasSet = new Set();
    const autoresSet = new Set();
    
    initialBooks.forEach(book => {
      categoriasSet.add(book.category);
      autoresSet.add(book.author);
    });

    // Mapeo para guardar las referencias (ID del documento)
    const categoriasMap = {};
    const autoresMap = {};

    // 1. Crear Categorias
    for (const catName of categoriasSet) {
      const catRef = doc(collection(db, "categoria"));
      batch.set(catRef, {
        nombre: catName,
        descripcion: `Categoría de ${catName}`
      });
      categoriasMap[catName] = catRef;
    }

    // 2. Crear Autores
    for (const autorName of autoresSet) {
      const autorRef = doc(collection(db, "autor"));
      batch.set(autorRef, {
        nombre: autorName,
        nacionalidad: "Desconocida", // Valor por defecto
        biblioteca: "Principal" // Valor por defecto
      });
      autoresMap[autorName] = autorRef;
    }

    // 3. Crear Libros
    initialBooks.forEach(book => {
      const libroRef = doc(collection(db, "libro"));
      
      // Generar un ISBN aleatorio
      const randomISBN = "978-" + Math.floor(Math.random() * 9000000000 + 1000000000);

      batch.set(libroRef, {
        titulo: book.title,
        precio: book.price,
        stock: book.stock,
        isbn: randomISBN,
        categoria: categoriasMap[book.category], // Referencia
        autor: autoresMap[book.author], // Referencia
        // Campos adicionales de UI
        description: book.description,
        gradient: book.gradient,
        icon: book.icon,
        image: book.image || null
      });
    });

    // Ejecutar el batch
    await batch.commit();
    console.log("Seeding completado con éxito.");
  } catch (error) {
    console.error("Error durante el seeding:", error);
  }
};
