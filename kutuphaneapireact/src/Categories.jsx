import React, { useEffect, useState } from "react";
import "./App.css";
import styles from './Categories.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Categories = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isOuterAccordionOpen, setIsOuterAccordionOpen] = useState(false);
    const [isUpdateAccordionOpen, setIsUpdateAccordionOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        categoryId: "",
        categoryName: "",
    });
    const [updateCategory, setUpdateCategory] = useState({
        categoryId: "",
        categoryName: "",
    });

    const [categoryId, setCategoryId] = useState("");
    const [categoryData, setCategoryData] = useState(null);
    const [isIdAccordionOpen, setIsIdAccordionOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);

    // API'den kategorileri al
    const fetchData = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Categories");
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

    // Yeni kategori ekleme
    const addCategory = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCategory),
            });

            if (!response.ok) {
                toast.error("Kategori eklenemedi!");
                throw new Error("Kategori eklenemedi");
            }

            toast.success("Kategori başarıyla eklendi!");
            fetchData();
            setNewCategory({
                categoryId: "",
                categoryName: "",
            });
            setShowPopup(false);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    // Kategori güncelleme
    const handleUpdateCategory = async () => {
        if (!updateCategory.categoryId) {
            toast.error("Kategori ID gerekli!");
            return;
        }

        try {
            const response = await fetch(`https://localhost:44359/api/Categories/${updateCategory.categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateCategory),
            });

            if (!response.ok) {
                toast.error("Kategori güncellenemedi!");
                throw new Error("Kategori güncellenemedi");
            }

            toast.success("Kategori başarıyla güncellendi!");
            fetchData();
            setShowUpdatePopup(false);
            setUpdateCategory({
                categoryId: "",
                categoryName: "",
            });
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    }
    // Kategori silme
    const deleteCategory = async (id) => {
        if (!id) {
            console.error("Silme işlemi için geçersiz ID:", id);
            return;
        }

        try {
            const response = await fetch(`https://localhost:44359/api/Categories/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                toast.error("Kategori silinemedi!");
                throw new Error("Kategori silinemedi: " + response.statusText);
            }
            toast.success("Kategori başarıyla silindi!");
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // ID ile kategori getir
    const fetchCategoryById = async () => {
        try {
            const response = await fetch(`https://localhost:44359/api/Categories/${categoryId}`);
            if (!response.ok) {
                throw new Error("Kategori getirilemedi: " + response.statusText);
            }
            const result = await response.json();
            setCategoryData(result);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Yeni Kategori Ekleme Popup bileşeni
    const AddCategoryPopup = () => {
        if (!showPopup) return null;

        return (
            <div className="popup-overlay" onClick={(e) => {
                if (e.target.className === 'popup-overlay') {
                    setShowPopup(false);
                }
            }}>
                <div className="popup-content">
                    <h2>Yeni Kategori Ekle</h2>
                    <input
                        type="text"
                        placeholder="Kategori Adı"
                        value={newCategory.categoryName}
                        onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={addCategory}>Ekle</button>
                        <button className="button-28" onClick={() => setShowPopup(false)}>İptal</button>
                    </div>
                </div>
            </div>
        );
    };

    // Kategori Güncelleme Popup bileşeni
    const UpdateCategoryPopup = () => {
        if (!showUpdatePopup) return null;

        return (
            <div className="popup-overlay" onClick={(e) => {
                if (e.target.className === 'popup-overlay') {
                    setShowUpdatePopup(false);
                }
            }}>
                <div className="popup-content">
                    <h2>Kategori Güncelle</h2>
                    <input
                        type="number"
                        placeholder="Kategori ID"
                        value={updateCategory.categoryId}
                        onChange={(e) => setUpdateCategory({ ...updateCategory, categoryId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Kategori Adı"
                        value={updateCategory.categoryName}
                        onChange={(e) => setUpdateCategory({ ...updateCategory, categoryName: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={handleUpdateCategory}>Güncelle</button>
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
                <cbutton2 onClick={() => setIsOuterAccordionOpen(!isOuterAccordionOpen)}>
                    {isOuterAccordionOpen ? "Kategorileri Gizle" : "Kategoriler"}
                </cbutton2>
                {isOuterAccordionOpen && (
                    <div>
                        <div>
                            <button className="button-28" onClick={() => setShowPopup(true)}>
                                Yeni Kategori Ekle
                            </button>
                        </div>

                        <div>
                            <cbutton2 onClick={() => setIsIdAccordionOpen(!isIdAccordionOpen)}>
                                {isIdAccordionOpen ? "ID ile Kategoriyi Gizle" : "ID ile Kategori Getir"}
                            </cbutton2>
                            {isIdAccordionOpen && (
                                <div>
                                    <h2>ID ile Kategori Getir</h2>
                                    <input
                                        type="number"
                                        placeholder="Kategori ID"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                    />
                                    <button className="button-28" role="button" onClick={fetchCategoryById}>
                                        Getir
                                    </button>

                                    {categoryData && (
                                        <div>
                                            <h3>Kategori Bilgileri</h3>
                                            <strong>Kategori ID:</strong> {categoryData.categoryId} <br />
                                            <strong>Kategori Adı:</strong> {categoryData.categoryName}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <cbutton2 onClick={() => setIsUpdateAccordionOpen(!isUpdateAccordionOpen)}>
                                {isUpdateAccordionOpen ? "Kategori Güncellemeyi Gizle" : "Kategori Güncelle"}
                            </cbutton2>
                            {isUpdateAccordionOpen && (
                                <div>
                                    <button className="button-28" onClick={() => setShowUpdatePopup(true)}>
                                        Kategori Güncelle
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <cbutton2 onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
                                {isAccordionOpen ? "Kategorileri Gizle" : "Kategorileri Göster"}
                            </cbutton2>
                            {isAccordionOpen && (
                                <div className="box-container">
                                    {data.length > 0 ? (
                                        data.map((category) => (
                                            <div className="box" key={category.categoryId}>
                                                <strong>Kategori ID:</strong> {category.categoryId} <br />
                                                <strong>Kategori Adı:</strong> {category.categoryName} <br />
                                                <div className="button-container">
                                                    <button className="button-28" role="button" onClick={() => deleteCategory(category.categoryId)}>
                                                        Sil
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>Hiç kategori bulunamadı.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <AddCategoryPopup />
            <UpdateCategoryPopup />
            <ToastContainer />
        </div>
    );
};

export default Categories;