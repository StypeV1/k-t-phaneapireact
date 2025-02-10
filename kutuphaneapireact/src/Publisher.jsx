import React, { useEffect, useState } from "react";
import "./App.css";
import styles from './Publisher.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Publisher = () => {  // Publishers -> Publisher olarak değiştirildi
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isOuterAccordionOpen, setIsOuterAccordionOpen] = useState(false);
    const [isUpdateAccordionOpen, setIsUpdateAccordionOpen] = useState(false);
    const [newPublisher, setNewPublisher] = useState({
        publisherId: "",
        publisherName: "",
    });
    const [updatePublisher, setUpdatePublisher] = useState({
        publisherId: "",
        publisherName: "",
    });

    const [publisherId, setPublisherId] = useState("");
    const [publisherData, setPublisherData] = useState(null);
    const [isIdAccordionOpen, setIsIdAccordionOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);

    // API'den yayınevlerini al
    const fetchData = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Publisher");  // URL değiştirildi
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

    // Yeni yayınevi ekleme
    const addPublisher = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Publisher", {  // URL değiştirildi
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPublisher),
            });

            if (!response.ok) {
                toast.error("Yayınevi eklenemedi!");
                throw new Error("Yayınevi eklenemedi");
            }

            toast.success("Yayınevi başarıyla eklendi!");
            fetchData();
            setNewPublisher({
                publisherId: "",
                publisherName: "",
            });
            setShowPopup(false);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    // Yayınevi güncelleme
    const handleUpdatePublisher = async () => {
        if (!updatePublisher.publisherId) {
            toast.error("Yayınevi ID gerekli!");
            return;
        }

        try {
            const response = await fetch(`https://localhost:44359/api/Publisher/${updatePublisher.publisherId}`, {  // URL değiştirildi
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatePublisher),
            });

            if (!response.ok) {
                toast.error("Yayınevi güncellenemedi!");
                throw new Error("Yayınevi güncellenemedi");
            }

            toast.success("Yayınevi başarıyla güncellendi!");
            fetchData();
            setShowUpdatePopup(false);
            setUpdatePublisher({
                publisherId: "",
                publisherName: "",
            });
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    // Yayınevi silme
    const deletePublisher = async (id) => {
        if (!id) {
            console.error("Silme işlemi için geçersiz ID:", id);
            return;
        }

        try {
            const response = await fetch(`https://localhost:44359/api/Publisher/${id}`, {  // URL değiştirildi
                method: "DELETE",
            });
            if (!response.ok) {
                toast.error("Yayınevi silinemedi!");
                throw new Error("Yayınevi silinemedi: " + response.statusText);
            }
            toast.success("Yayınevi başarıyla silindi!");
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // ID ile yayınevi getir
    const fetchPublisherById = async () => {
        try {
            const response = await fetch(`https://localhost:44359/api/Publisher/${publisherId}`);  // URL değiştirildi
            if (!response.ok) {
                throw new Error("Yayınevi getirilemedi: " + response.statusText);
            }
            const result = await response.json();
            setPublisherData(result);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Yeni Yayınevi Ekleme Popup bileşeni
    const AddPublisherPopup = () => {
        if (!showPopup) return null;

        return (
            <div className="popup-overlay" onClick={(e) => {
                if (e.target.className === 'popup-overlay') {
                    setShowPopup(false);
                }
            }}>
                <div className="popup-content">
                    <h2>Yeni Yayınevi Ekle</h2>
                    <input
                        type="text"
                        placeholder="Yayınevi Adı"
                        value={newPublisher.publisherName}
                        onChange={(e) => setNewPublisher({ ...newPublisher, publisherName: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={addPublisher}>Ekle</button>
                        <button className="button-28" onClick={() => setShowPopup(false)}>İptal</button>
                    </div>
                </div>
            </div>
        );
    };

    // Yayınevi Güncelleme Popup bileşeni
    const UpdatePublisherPopup = () => {
        if (!showUpdatePopup) return null;

        return (
            <div className="popup-overlay" onClick={(e) => {
                if (e.target.className === 'popup-overlay') {
                    setShowUpdatePopup(false);
                }
            }}>
                <div className="popup-content">
                    <h2>Yayınevi Güncelle</h2>
                    <input
                        type="number"
                        placeholder="Yayınevi ID"
                        value={updatePublisher.publisherId}
                        onChange={(e) => setUpdatePublisher({ ...updatePublisher, publisherId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Yayınevi Adı"
                        value={updatePublisher.publisherName}
                        onChange={(e) => setUpdatePublisher({ ...updatePublisher, publisherName: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={handleUpdatePublisher}>Güncelle</button>
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
                <pbutton2 onClick={() => setIsOuterAccordionOpen(!isOuterAccordionOpen)}>
                    {isOuterAccordionOpen ? "Yayınevlerini Gizle" : "Yayınevleri"}
                </pbutton2>
                {isOuterAccordionOpen && (
                    <div>
                        <div>
                            <button className="button-28" onClick={() => setShowPopup(true)}>
                                Yeni Yayınevi Ekle
                            </button>
                        </div>

                        <div>
                            <pbutton2 onClick={() => setIsIdAccordionOpen(!isIdAccordionOpen)}>
                                {isIdAccordionOpen ? "ID ile Yayınevini Gizle" : "ID ile Yayınevi Getir"}
                            </pbutton2>
                            {isIdAccordionOpen && (
                                <div>
                                    <h2>ID ile Yayınevi Getir</h2>
                                    <input
                                        type="number"
                                        placeholder="Yayınevi ID"
                                        value={publisherId}
                                        onChange={(e) => setPublisherId(e.target.value)}
                                    />
                                    <button className="button-28" role="button" onClick={fetchPublisherById}>
                                        Getir
                                    </button>

                                    {publisherData && (
                                        <div>
                                            <h3>Yayınevi Bilgileri</h3>
                                            <strong>Yayınevi ID:</strong> {publisherData.publisherId} <br />
                                            <strong>Yayınevi Adı:</strong> {publisherData.publisherName}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <pbutton2 onClick={() => setIsUpdateAccordionOpen(!isUpdateAccordionOpen)}>
                                {isUpdateAccordionOpen ? "Yayınevi Güncellemeyi Gizle" : "Yayınevi Güncelle"}
                            </pbutton2>
                            {isUpdateAccordionOpen && (
                                <div>
                                    <button className="button-28" onClick={() => setShowUpdatePopup(true)}>
                                        Yayınevi Güncelle
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <pbutton2 onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
                                {isAccordionOpen ? "Yayınevlerini Gizle" : "Yayınevlerini Göster"}
                            </pbutton2>
                            {isAccordionOpen && (
                                <div className="box-container">
                                    {data.length > 0 ? (
                                        data.map((publisher) => (
                                            <div className="box" key={publisher.publisherId}>
                                                <strong>Yayınevi ID:</strong> {publisher.publisherId} <br />
                                                <strong>Yayınevi Adı:</strong> {publisher.publisherName} <br />
                                                <div className="button-container">
                                                    <button className="button-28" role="button" onClick={() => deletePublisher(publisher.publisherId)}>
                                                        Sil
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>Hiç yayınevi bulunamadı.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <AddPublisherPopup />
            <UpdatePublisherPopup />
            <ToastContainer />
        </div>
    );
};

export default Publisher;