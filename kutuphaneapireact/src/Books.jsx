import React, { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Books = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]); // Yeni eklendi
    const [publishers, setPublishers] = useState([]); // Yeni eklendi
    const [error, setError] = useState("");
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isOuterAccordionOpen, setIsOuterAccordionOpen] = useState(false);
    const [isUpdateAccordionOpen, setIsUpdateAccordionOpen] = useState(false);
    const [newBook, setNewBook] = useState({
        booksId: "",
        booksName: "",
        booksPage: "",
        categoryId: "",
        publisherId: "",
        writerId: [],
    });
    const [updateBook, setUpdateBook] = useState({
        booksId: "",
        booksName: "",
        booksPage: "",
        categoryId: "",
        publisherId: "",
        writerId: "",
    });
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [bookId, setBookId] = useState("");
    const [bookData, setBookData] = useState(null);
    const [isIdAccordionOpen, setIsIdAccordionOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    // Kategorileri getir
    const fetchCategories = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Categories");
            if (!response.ok) throw new Error("Kategoriler getirilemedi");
            const result = await response.json();
            setCategories(result);
        } catch (err) {
            console.error("Kategoriler yüklenirken hata:", err);
        }
    };

    // Yayınevlerini getir
    const fetchPublishers = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Publisher");
            if (!response.ok) throw new Error("Yayınevleri getirilemedi");
            const result = await response.json();
            setPublishers(result);
        } catch (err) {
            console.error("Yayınevleri yüklenirken hata:", err);
        }
    };

    // Helper fonksiyonlar
    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.categoryId === categoryId);
        return category ? category.categoryName : 'Kategori bulunamadı';
    };

    const getPublisherName = (publisherId) => {
        const publisher = publishers.find(p => p.publisherId === publisherId);
        return publisher ? publisher.publisherName : 'Yayınevi bulunamadı';
    };

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
    }
    // Yeni kitap ekleme
    const addBook = async () => {
        try {
            const bookToAdd = {
                booksName: newBook.booksName,
                booksPage: parseInt(newBook.booksPage),
                categoryId: parseInt(newBook.categoryId),
                publisherId: parseInt(newBook.publisherId),
                writer: [{
                    writerId: parseInt(newBook.writerId),
                    writerName: "",
                    writerSurname: ""
                }],
            };

            const response = await fetch("https://localhost:44359/api/Books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookToAdd),
            });

            if (!response.ok) {
                toast.error("Kitap eklenemedi!");
                throw new Error("Kitap eklenemedi");
            }

            toast.success("Kitap başarıyla eklendi!");
            fetchData();
            setNewBook({
                booksId: "",
                booksName: "",
                booksPage: "",
                categoryId: "",
                publisherId: "",
                writerId: "",
            });
            setShowPopup(false);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    // Kitap güncelleme
    const handleUpdateBook = async () => {
        if (!updateBook.booksId) {
            toast.error("Kitap ID gerekli!");
            return;
        }

        try {
            const bookToUpdate = {
                booksName: updateBook.booksName,
                booksPage: parseInt(updateBook.booksPage),
                categoryId: parseInt(updateBook.categoryId),
                publisherId: parseInt(updateBook.publisherId),
                writer: [{
                    writerId: parseInt(updateBook.writerId),
                    writerName: "",
                    writerSurname: ""
                }],
            };

            const response = await fetch(`https://localhost:44359/api/Books/${updateBook.booksId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookToUpdate),
            });

            if (!response.ok) {
                toast.error("Kitap güncellenemedi!");
                throw new Error("Kitap güncellenemedi");
            }

            toast.success("Kitap başarıyla güncellendi!");
            fetchData();
            setShowUpdatePopup(false);
            setUpdateBook({
                booksId: "",
                booksName: "",
                booksPage: "",
                categoryId: "",
                publisherId: "",
                writerId: "",
            });
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
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
                toast.error("Kitap silinemedi!");
                throw new Error("Kitap silinemedi: " + response.statusText);
            }
            toast.success("Kitap başarıyla silindi!");
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
        fetchCategories(); // Yeni eklendi
        fetchPublishers(); // Yeni eklendi
    }, [])
    // Yeni Kitap Ekleme Popup bileşeni
    const AddBookPopup = () => {
        if (!showPopup) return null;

        return (
            <div className="popup-overlay" onClick={(e) => {
                if (e.target.className === 'popup-overlay') {
                    setShowPopup(false);
                }
            }}>
                <div className="popup-content">
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
                        value={newBook.writerId}
                        onChange={(e) => setNewBook({ ...newBook, writerId: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={addBook}>Ekle</button>
                        <button className="button-28" onClick={() => setShowPopup(false)}>İptal</button>
                    </div>
                </div>
            </div>
        );
    };

    // Kitap Güncelleme Popup bileşeni
    const UpdateBookPopup = () => {
        if (!showUpdatePopup) return null;

        return (
            <div className="popup-overlay" onClick={(e) => {
                if (e.target.className === 'popup-overlay') {
                    setShowUpdatePopup(false);
                }
            }}>
                <div className="popup-content">
                    <h2>Kitap Güncelle</h2>
                    <input
                        type="number"
                        placeholder="Kitap ID"
                        value={updateBook.booksId}
                        onChange={(e) => setUpdateBook({ ...updateBook, booksId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Kitap Adı"
                        value={updateBook.booksName}
                        onChange={(e) => setUpdateBook({ ...updateBook, booksName: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Sayfa Sayısı"
                        value={updateBook.booksPage}
                        onChange={(e) => setUpdateBook({ ...updateBook, booksPage: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Kategori ID"
                        value={updateBook.categoryId}
                        onChange={(e) => setUpdateBook({ ...updateBook, categoryId: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Yayınevi ID"
                        value={updateBook.publisherId}
                        onChange={(e) => setUpdateBook({ ...updateBook, publisherId: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Yazar ID"
                        value={updateBook.writerId}
                        onChange={(e) => setUpdateBook({ ...updateBook, writerId: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={handleUpdateBook}>Güncelle</button>
                        <button className="button-28" onClick={() => setShowUpdatePopup(false)}>İptal</button>
                    </div>
                </div>
            </div>
        );
    };

    if (error) {
        return <div>Hata: {error}</div>;
    }

    return (
        <div>
            <div>
                <button2 onClick={() => setIsOuterAccordionOpen(!isOuterAccordionOpen)}>
                    {isOuterAccordionOpen ? "Kitapları Gizle" : "Kitaplar"}
                </button2>
                {isOuterAccordionOpen && (
                    <div>
                        <div>
                            <button className="button-28" onClick={() => setShowPopup(true)}>
                                Yeni Kitap Ekle
                            </button>
                        </div>

                        <div2>
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
                                    <button className="button-28" role="button" onClick={fetchBookById}>
                                        Getir
                                    </button>

                                    {bookData && (
                                        <div>
                                            <h3>Kitap Bilgileri</h3>
                                            <strong>Kitap Id:</strong> {bookData.booksId} <br />
                                            <strong>Kitap Adı:</strong> {bookData.booksName} <br />
                                            <strong>Sayfa Sayısı:</strong> {bookData.booksPage} <br />
                                            <strong>Kategori:</strong> {getCategoryName(bookData.categoryId)} <br />
                                            <strong>Yayınevi:</strong> {getPublisherName(bookData.publisherId)} <br />
                                            <strong>Yazarlar:</strong>{" "}
                                            {bookData.writer && bookData.writer.length > 0
                                                ? bookData.writer.map((writer) => writer.writerId).join(", ")
                                                : "Yazar yok"}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div2>

                        <div>
                            <button2 onClick={() => setIsUpdateAccordionOpen(!isUpdateAccordionOpen)}>
                                {isUpdateAccordionOpen ? "Kitap Güncellemeyi Gizle" : "Kitap Güncelle"}
                            </button2>
                            {isUpdateAccordionOpen && (
                                <div>
                                    <button className="button-28" onClick={() => setShowUpdatePopup(true)}>
                                        Kitap Güncelle
                                    </button>
                                </div>
                            )}
                        </div>

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
                                                <strong>Kategorisi:</strong> {getCategoryName(books.categoryId)} <br />
                                                <strong>Yayınevi:</strong> {getPublisherName(books.publisherId)} <br />
                                                <strong>Yazarlar:</strong>{" "}
                                                {books.writer && books.writer.length > 0
                                                    ? books.writer.map((writer) => writer.writerId).join(", ")
                                                    : "Yazar yok"}{" "}
                                                <br />
                                                <div className="button-container">
                                                    <button className="button-28" role="button" onClick={() => deleteBook(books.booksId || books.id)}>
                                                        Sil
                                                    </button>
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
            <AddBookPopup />
            <UpdateBookPopup />
            <ToastContainer />
        </div>
    );
};

export default Books;