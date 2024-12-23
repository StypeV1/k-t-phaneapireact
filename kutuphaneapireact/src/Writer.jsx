import React, { useEffect, useState } from "react";
import "./App.css";

const Writers = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isOuterAccordionOpen, setIsOuterAccordionOpen] = useState(false);
    const [newWriter, setNewWriter] = useState({
        writerId: "",
        writerName: "",
        writerSurname: "",
    });

    const [writerId, setWriterId] = useState("");
    const [writerData, setWriterData] = useState(null);
    const [isIdAccordionOpen, setIsIdAccordionOpen] = useState(false);

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

            if (!response.ok) throw new Error("Yazar eklenemedi: " + response.statusText);

            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // Yazar güncelleme
    const updateWriter = async (id) => {
        if (!id) {
            console.error("Güncelleme işlemi için geçersiz ID:", id);
            return;
        }

        const updatedWriter = {
            writerId: id, // ID'yi nesneye ekliyoruz
            writerName: newWriter.writerName,
            writerSurname: newWriter.writerSurname,
        };

        try {
            const response = await fetch(`https://localhost:44359/api/Writer/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedWriter),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Güncelleme hatası:", errorData);
                throw new Error("Yazar güncellenemedi: " + response.statusText);
            }
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };
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
                const errorData = await response.json();
                console.error("Silme hatası:", errorData);
                throw new Error("Yazar silinemedi: " + response.statusText);
            }
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

    if (error) {
        return <div>Hata: {error}</div>;
    }

    return (
        <div>


            {/* Dış Accordion */}
            <div>
                <button2 onClick={() => setIsOuterAccordionOpen(!isOuterAccordionOpen)}>
                    {isOuterAccordionOpen ? "Yazarları Gizle" : "Yazarlar"}
                </button2>
                {isOuterAccordionOpen && (
                    <div>
                        {/* Yeni Yazar Ekleme Formu */}
                        <div>
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
                            <button onClick={addWriter}>Ekle</button>
                            <h6 className="desc">Yazar güncellemek için bilgileri doldurduktan sonra güncellemek istediğiniz yazarın yanında ki güncelle butonuna basınız.</h6>
                        </div>

                        {/* ID ile Yazar Getirme Accordion */}
                        <div>
                            <button2 onClick={() => setIsIdAccordionOpen(!isIdAccordionOpen)}>
                                {isIdAccordionOpen ? "ID ile Yazarı Gizle" : "ID ile Yazar Getir"}
                            </button2>
                            {isIdAccordionOpen && (
                                <div>
                                    <h2>ID ile Yazar Getir</h2>
                                    <input
                                        type="number"
                                        placeholder="Yazar ID"
                                        value={writerId}
                                        onChange={(e) => setWriterId(e.target.value)}
                                    />
                                    <button onClick={fetchWriterById}>Getir</button>
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

                        {/* İç Accordion */}
                        <div>
                            <button2 onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
                                {isAccordionOpen ? "Yazarları Gizle" : "Yazarları Göster"}
                            </button2>
                            {isAccordionOpen && (
                                <div className="box-container">
                                    {data.length > 0 ? (
                                        data.map((writer) => (
                                            <div className="box" key={writer.writerId}>
                                                <strong>Yazar ID:</strong> {writer.writerId} <br />
                                                <strong>Yazar Adı:</strong> {writer.writerName} <br />
                                                <strong>Yazar Soyadı:</strong> {writer.writerSurname} <br />
                                                <div className="button-container">
                                                    <button3 onClick={() => updateWriter(writer.writerId)}>
                                                        Güncelle
                                                    </button3>
                                                    <button3 onClick={() => deleteWriter(writer.writerId)}>
                                                        Sil
                                                    </button3>
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
        </div>
    );
};

export default Writers;
