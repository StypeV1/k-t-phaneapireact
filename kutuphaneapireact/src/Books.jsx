import React, { useEffect, useState } from "react";
import "./App.css";
import "./index.css";

const Books = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isOuterAccordionOpen, setIsOuterAccordionOpen] = useState(false);
    const [newBook, setNewBook] = useState({
        booksId: "",
        booksName: "",
        booksPage: "",
        categoryId: "",
        publisherId: "",
        writerId: [],
    });

    const [bookId, setBookId] = useState("");
    const [bookData, setBookData] = useState(null);
    const [isIdAccordionOpen, setIsIdAccordionOpen] = useState(false);

    // API'den kitapları al
    const fetchData = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Books");
            if (!response.ok) {
                throw new Error("API'ye bağlanılamadı: " + response.statusText);
            }
            const result = await response.json();
            console.log("Backend Verisi:", result);
            setData(result);
        } catch (err) {
            setError(err.message);
        }
    };

    // Yeni kitap ekleme
    const addBook = async () => {
        try {
            const bookToAdd = {
                booksName: newBook.booksName,
                booksPage: newBook.booksPage,
                categoryId: newBook.categoryId,
                publisherId: newBook.publisherId,
                writer: newBook.writerId.map((id) => ({
                    writerId: id,
                })),
            };

            const response = await fetch("https://localhost:44359/api/Books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookToAdd),
            });

            if (!response.ok) throw new Error("Kitap eklenemedi: " + response.statusText);

            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // Kitap güncelleme
    const updateBook = async (id) => {
        if (!id) {
            console.error("Güncelleme işlemi için geçersiz ID:", id);
            return;
        }

        const updatedBook = {
            booksName: newBook.booksName,
            booksPage: newBook.booksPage,
            categoryId: newBook.categoryId,
            publisherId: newBook.publisherId,
            writer: newBook.writerId.map((id) => ({
                writerId: id,
            })),
        };

        try {
            const response = await fetch(`https://localhost:44359/api/Books/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBook),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Güncelleme hatası:", errorData);
                throw new Error("Kitap güncellenemedi: " + response.statusText);
            }
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // Kitap silme
    const deleteBook = async (id) => {
        if (!id) {
            console.error("Silme işlemi için geçersiz ID:", id);
            return;
        }

        try {
            const response = await fetch(`https://localhost:44359/api/Books/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Silme hatası:", errorData);
                throw new Error("Kitap silinemedi: " + response.statusText);
            }
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // ID ile kitap getir
    const fetchBookById = async () => {
        try {
            const response = await fetch(`https://localhost:44359/api/Books/${bookId}`);
            if (!response.ok) {
                throw new Error("Kitap getirilemedi: " + response.statusText);
            }
            const result = await response.json();
            setBookData(result);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (error) {
        return <div>Hata: {error}</div>;
    }

    return (
        <div>
            <h1>Kütüphane API</h1>

            {/* Dış Accordion */}
            <div>
                <button2 onClick={() => setIsOuterAccordionOpen(!isOuterAccordionOpen)}>
                    {isOuterAccordionOpen ? "Kitapları Gizle" : "Kitaplar"}
                </button2>
                {isOuterAccordionOpen && (
                    <div>
                        {/* Yeni Kitap Ekleme Formu */}
                        <div>
                            <h2>Yeni Kitap Ekle</h2>
                            <input
                                type="text"
                                placeholder="Kitap Adı"
                                value={newBook.booksName}
                                onChange={(e) => setNewBook({ ...newBook, booksName: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Sayfa Sayısı"
                                value={newBook.booksPage}
                                onChange={(e) => setNewBook({ ...newBook, booksPage: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Kategori ID"
                                value={newBook.categoryId}
                                onChange={(e) => setNewBook({ ...newBook, categoryId: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Yayınevi ID"
                                value={newBook.publisherId}
                                onChange={(e) => setNewBook({ ...newBook, publisherId: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Yazar ID"
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setNewBook((prevBook) => ({
                                        ...prevBook,
                                        writerId: [...prevBook.writerId, value],
                                    }));
                                }}
                            />
                            <button onClick={addBook}>Ekle</button>
                            <h6 className="desc">Kitap güncellemek için bilgileri doldurduktan sonra güncellemek istediğiniz kitabın yanında ki güncelle butonuna basınız.</h6>
                        </div>

                        {/* ID ile Kitap Getirme Accordion */}
                        <div>
                            <button2 onClick={() => setIsIdAccordionOpen(!isIdAccordionOpen)}>
                                {isIdAccordionOpen ? "ID ile Kitabı Gizle" : "ID ile Kitap Getir"}
                            </button2>
                            {isIdAccordionOpen && (
                                <div>
                                    <h2>ID ile Kitap Getir</h2>
                                    <input
                                        type="number"
                                        placeholder="Kitap ID"
                                        value={bookId}
                                        onChange={(e) => setBookId(e.target.value)}
                                    />
                                    <button onClick={fetchBookById}>Getir</button>
                                    {bookData && (
                                        <div>
                                            <h3>Kitap Bilgileri</h3>
                                            <strong>Kitap Id:</strong> {bookData.booksId} <br />
                                            <strong>Kitap Adı:</strong> {bookData.booksName} <br />
                                            <strong>Sayfa Sayısı:</strong> {bookData.booksPage} <br />
                                            <strong>Kategori ID:</strong> {bookData.categoryId} <br />
                                            <strong>Yayınevi ID:</strong> {bookData.publisherId} <br />
                                            <strong>Yazarlar:</strong>{" "}
                                            {bookData.writer && bookData.writer.length > 0
                                                ? bookData.writer.map((writer) => writer.writerId).join(", ")
                                                : "Yazar yok"}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* İç Accordion */}
                        <div>
                            <button2 onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
                                {isAccordionOpen ? "Kitapları Gizle" : "Kitapları Göster"}
                            </button2>
                            {isAccordionOpen && (
                                <div className="box-container">
                                    {data.length > 0 ? (
                                        data.map((books) => (
                                            <div className="box" key={books.booksId || books.id}>
                                                <strong>Kitap Id:</strong> {books.booksId} <br />
                                                <strong>Kitap Adı:</strong> {books.booksName} <br />
                                                <strong>Sayfa Sayısı:</strong> {books.booksPage} <br />
                                                <strong>Kategorisi:</strong> {books.categoryId} <br />
                                                <strong>Yayınevi:</strong> {books.publisherId} <br />
                                                <strong>Yazarlar:</strong>{" "}
                                                {books.writer && books.writer.length > 0
                                                    ? books.writer.map((writer) => writer.writerId).join(", ")
                                                    : "Yazar yok"}{" "}
                                                <br />
                                                <div className="button-container">
                                                    <button3 onClick={() => updateBook(books.booksId || books.id)}>
                                                        Güncelle
                                                    </button3>
                                                    <button3 onClick={() => deleteBook(books.booksId || books.id)}>
                                                        Sil
                                                    </button3>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>Hiç kitap bulunamadı.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Books;
