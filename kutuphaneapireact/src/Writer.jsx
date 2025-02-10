import React, { useEffect, useState } from "react";
import "./App.css";
import "./Writer.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Writers = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isOuterAccordionOpen, setIsOuterAccordionOpen] = useState(false);
    const [isUpdateAccordionOpen, setIsUpdateAccordionOpen] = useState(false);
    const [newWriter, setNewWriter] = useState({
        writerId: "",
        writerName: "",
        writerSurname: "",
    });
    const [updateWriter, setUpdateWriter] = useState({
        writerId: "",
        writerName: "",
        writerSurname: "",
    });

    const [writerId, setWriterId] = useState("");
    const [writerData, setWriterData] = useState(null);
    const [isIdAccordionOpen, setIsIdAccordionOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);

    // API'den yazarları al
    const fetchData = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Writer");
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

    // Yeni yazar ekleme
    const addWriter = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Writer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newWriter),
            });

            if (!response.ok) {
                toast.error("Yazar eklenemedi!");
                throw new Error("Yazar eklenemedi");
            }

            toast.success("Yazar başarıyla eklendi!");
            fetchData();
            setNewWriter({
                writerId: "",
                writerName: "",
                writerSurname: "",
            });
            setShowPopup(false);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    // Yazar güncelleme
    const handleUpdateWriter = async () => {
        if (!updateWriter.writerId) {
            toast.error("Yazar ID gerekli!");
            return;
        }

        try {
            const response = await fetch(`https://localhost:44359/api/Writer/${updateWriter.writerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateWriter),
            });

            if (!response.ok) {
                toast.error("Yazar güncellenemedi!");
                throw new Error("Yazar güncellenemedi");
            }

            toast.success("Yazar başarıyla güncellendi!");
            fetchData();
            setShowUpdatePopup(false);
            setUpdateWriter({
                writerId: "",
                writerName: "",
                writerSurname: "",
            });
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    }
    // Yazar silme
    const deleteWriter = async (id) => {
        if (!id) {
            console.error("Silme işlemi için geçersiz ID:", id);
            return;
        }

        try {
            const response = await fetch(`https://localhost:44359/api/Writer/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                toast.error("Yazar silinemedi!");
                throw new Error("Yazar silinemedi: " + response.statusText);
            }
            toast.success("Yazar başarıyla silindi!");
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // ID ile yazar getir
    const fetchWriterById = async () => {
        try {
            const response = await fetch(`https://localhost:44359/api/Writer/${writerId}`);
            if (!response.ok) {
                throw new Error("Yazar getirilemedi: " + response.statusText);
            }
            const result = await response.json();
            setWriterData(result);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Yeni Yazar Ekleme Popup bileşeni
    const AddWriterPopup = () => {
        if (!showPopup) return null;

        return (
            <div className="popup-overlay" onClick={(e) => {
                if (e.target.className === 'popup-overlay') {
                    setShowPopup(false);
                }
            }}>
                <div className="popup-content">
                    <h2>Yeni Yazar Ekle</h2>
                    <input
                        type="text"
                        placeholder="Yazar Adı"
                        value={newWriter.writerName}
                        onChange={(e) => setNewWriter({ ...newWriter, writerName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Yazar Soyadı"
                        value={newWriter.writerSurname}
                        onChange={(e) => setNewWriter({ ...newWriter, writerSurname: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={addWriter}>Ekle</button>
                        <button className="button-28" onClick={() => setShowPopup(false)}>İptal</button>
                    </div>
                </div>
            </div>
        );
    };

    // Yazar Güncelleme Popup bileşeni
    const UpdateWriterPopup = () => {
        if (!showUpdatePopup) return null;

        return (
            <div className="popup-overlay" onClick={(e) => {
                if (e.target.className === 'popup-overlay') {
                    setShowUpdatePopup(false);
                }
            }}>
                <div className="popup-content">
                    <h2>Yazar Güncelle</h2>
                    <input
                        type="number"
                        placeholder="Yazar ID"
                        value={updateWriter.writerId}
                        onChange={(e) => setUpdateWriter({ ...updateWriter, writerId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Yazar Adı"
                        value={updateWriter.writerName}
                        onChange={(e) => setUpdateWriter({ ...updateWriter, writerName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Yazar Soyadı"
                        value={updateWriter.writerSurname}
                        onChange={(e) => setUpdateWriter({ ...updateWriter, writerSurname: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={handleUpdateWriter}>Güncelle</button>
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
                <wbutton2 onClick={() => setIsOuterAccordionOpen(!isOuterAccordionOpen)}>
                    {isOuterAccordionOpen ? "Yazarları Gizle" : "Yazarlar"}
                </wbutton2>
                {isOuterAccordionOpen && (
                    <div>
                        <div>
                            <button className="button-28" onClick={() => setShowPopup(true)}>
                                Yeni Yazar Ekle
                            </button>
                        </div>

                        <div>
                            <wbutton2 onClick={() => setIsIdAccordionOpen(!isIdAccordionOpen)}>
                                {isIdAccordionOpen ? "ID ile Yazarı Gizle" : "ID ile Yazar Getir"}
                            </wbutton2>
                            {isIdAccordionOpen && (
                                <div>
                                    <h2>ID ile Yazar Getir</h2>
                                    <input
                                        type="number"
                                        placeholder="Yazar ID"
                                        value={writerId}
                                        onChange={(e) => setWriterId(e.target.value)}
                                    />
                                    <button className="button-28" role="button" onClick={fetchWriterById}>
                                        Getir
                                    </button>

                                    {writerData && (
                                        <div>
                                            <h3>Yazar Bilgileri</h3>
                                            <strong>Yazar ID:</strong> {writerData.writerId} <br />
                                            <strong>Yazar Adı:</strong> {writerData.writerName} <br />
                                            <strong>Yazar Soyadı:</strong> {writerData.writerSurname}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <wbutton2 onClick={() => setIsUpdateAccordionOpen(!isUpdateAccordionOpen)}>
                                {isUpdateAccordionOpen ? "Yazar Güncellemeyi Gizle" : "Yazar Güncelle"}
                            </wbutton2>
                            {isUpdateAccordionOpen && (
                                <div>
                                    <button className="button-28" onClick={() => setShowUpdatePopup(true)}>
                                        Yazar Güncelle
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <wbutton2 onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
                                {isAccordionOpen ? "Yazarları Gizle" : "Yazarları Göster"}
                            </wbutton2>
                            {isAccordionOpen && (
                                <div className="box-container">
                                    {data.length > 0 ? (
                                        data.map((writer) => (
                                            <div className="box" key={writer.writerId}>
                                                <strong>Yazar ID:</strong> {writer.writerId} <br />
                                                <strong>Yazar Adı:</strong> {writer.writerName} <br />
                                                <strong>Yazar Soyadı:</strong> {writer.writerSurname} <br />
                                                <div className="button-container">
                                                    <button className="button-28" role="button" onClick={() => deleteWriter(writer.writerId)}>
                                                        Sil
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>Hiç yazar bulunamadı.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <AddWriterPopup />
            <UpdateWriterPopup />
            <ToastContainer />
        </div>
    );
};

export default Writers;