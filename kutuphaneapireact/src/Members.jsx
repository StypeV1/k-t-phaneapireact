import React, { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import styles from './Members.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Members = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isOuterAccordionOpen, setIsOuterAccordionOpen] = useState(false);
    const [isUpdateAccordionOpen, setIsUpdateAccordionOpen] = useState(false);
    const [newMember, setNewMember] = useState({
        membersId: "",
        membersName: "",
        membersSurname: "",
        membersAge: "",
        membersGender: "",
    });
    const [updateMember, setUpdateMember] = useState({
        membersId: "",
        membersName: "",
        membersSurname: "",
        membersAge: "",
        membersGender: "",
    });
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [memberId, setMemberId] = useState("");
    const [memberData, setMemberData] = useState(null);
    const [isIdAccordionOpen, setIsIdAccordionOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    // API'den üyeleri al
    const fetchData = async () => {
        try {
            const response = await fetch("https://localhost:44359/api/Members");
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

    // Yeni üye ekleme
    const addMember = async () => {
        try {
            const memberToAdd = {
                membersName: newMember.membersName,
                membersSurname: newMember.membersSurname,
                membersAge: parseInt(newMember.membersAge),
                membersGender: newMember.membersGender,
                books: [] // Boş books dizisi eklendi
            };

            const response = await fetch("https://localhost:44359/api/Members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(memberToAdd),
            });

            if (!response.ok) {
                toast.error("Üye eklenemedi!");
                throw new Error("Üye eklenemedi");
            }

            toast.success("Üye başarıyla eklendi!");
            fetchData();
            setNewMember({
                membersId: "",
                membersName: "",
                membersSurname: "",
                membersAge: "",
                membersGender: "",
            });
            setShowPopup(false);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    }
    // Üye güncelleme
    const handleUpdateMember = async () => {
        if (!updateMember.membersId) {
            toast.error("Üye ID gerekli!");
            return;
        }

        try {
            const memberToUpdate = {
                membersName: updateMember.membersName,
                membersSurname: updateMember.membersSurname,
                membersAge: parseInt(updateMember.membersAge),
                membersGender: updateMember.membersGender,
                books: [] // Boş books dizisi eklendi
            };

            const response = await fetch(`https://localhost:44359/api/Members/${updateMember.membersId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(memberToUpdate),
            });

            if (!response.ok) {
                toast.error("Üye güncellenemedi!");
                throw new Error("Üye güncellenemedi");
            }

            toast.success("Üye başarıyla güncellendi!");
            fetchData();
            setShowUpdatePopup(false);
            setUpdateMember({
                membersId: "",
                membersName: "",
                membersSurname: "",
                membersAge: "",
                membersGender: "",
            });
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    // Üye silme
    const deleteMember = async (id) => {
        if (!id) {
            console.error("Silme işlemi için geçersiz ID:", id);
            return;
        }

        try {
            const response = await fetch(`https://localhost:44359/api/Members/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                toast.error("Üye silinemedi!");
                throw new Error("Üye silinemedi: " + response.statusText);
            }
            toast.success("Üye başarıyla silindi!");
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // ID ile üye getir
    const fetchMemberById = async () => {
        try {
            const response = await fetch(`https://localhost:44359/api/Members/${memberId}`);
            if (!response.ok) {
                throw new Error("Üye getirilemedi: " + response.statusText);
            }
            const result = await response.json();
            setMemberData(result);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Yeni Üye Ekleme Popup bileşeni
    const AddMemberPopup = () => {
        return (
            <div className="popup-overlay">
                <div className="popup-content" onClick={e => e.stopPropagation()}>
                    <h2>Yeni Üye Ekle</h2>
                    <input
                        type="text"
                        placeholder="Üye Adı"
                        value={newMember.membersName}
                        onChange={(e) => setNewMember({ ...newMember, membersName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Üye Soyadı"
                        value={newMember.membersSurname}
                        onChange={(e) => setNewMember({ ...newMember, membersSurname: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Üye Yaşı"
                        value={newMember.membersAge}
                        onChange={(e) => setNewMember({ ...newMember, membersAge: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Üye Cinsiyeti"
                        value={newMember.membersGender}
                        onChange={(e) => setNewMember({ ...newMember, membersGender: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={addMember}>Ekle</button>
                        <button className="button-28" onClick={() => setShowPopup(false)}>İptal</button>
                    </div>
                </div>
            </div>
        );
    }
    // Üye Güncelleme Popup bileşeni
    const UpdateMemberPopup = () => {
        return (
            <div className="popup-overlay">
                <div className="popup-content" onClick={e => e.stopPropagation()}>
                    <h2>Üye Güncelle</h2>
                    <input
                        type="number"
                        placeholder="Üye ID"
                        value={updateMember.membersId}
                        onChange={(e) => setUpdateMember({ ...updateMember, membersId: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Üye Adı"
                        value={updateMember.membersName}
                        onChange={(e) => setUpdateMember({ ...updateMember, membersName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Üye Soyadı"
                        value={updateMember.membersSurname}
                        onChange={(e) => setUpdateMember({ ...updateMember, membersSurname: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Üye Yaşı"
                        value={updateMember.membersAge}
                        onChange={(e) => setUpdateMember({ ...updateMember, membersAge: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Üye Cinsiyeti"
                        value={updateMember.membersGender}
                        onChange={(e) => setUpdateMember({ ...updateMember, membersGender: e.target.value })}
                    />
                    <div className="popup-buttons">
                        <button className="button-28" onClick={handleUpdateMember}>Güncelle</button>
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
        <>
            <div>
                <mbutton2 onClick={() => setIsOuterAccordionOpen(!isOuterAccordionOpen)}>
                    {isOuterAccordionOpen ? "Üyeleri Gizle" : "Üyeler"}
                </mbutton2>
                {isOuterAccordionOpen && (
                    <div>
                        <div>
                            <button className="button-28" onClick={() => setShowPopup(true)}>
                                Yeni Üye Ekle
                            </button>
                        </div>

                        <div2>
                            <mbutton2 onClick={() => setIsIdAccordionOpen(!isIdAccordionOpen)}>
                                {isIdAccordionOpen ? "ID ile Üyeyi Gizle" : "ID ile Üye Getir"}
                            </mbutton2>
                            {isIdAccordionOpen && (
                                <div>
                                    <h2>ID ile Üye Getir</h2>
                                    <input
                                        type="number"
                                        placeholder="Üye ID"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                    />
                                    <button className="button-28" role="button" onClick={fetchMemberById}>
                                        Getir
                                    </button>

                                    {memberData && (
                                        <div>
                                            <h3>Üye Bilgileri</h3>
                                            <strong>Üye Id:</strong> {memberData.membersId} <br />
                                            <strong>Üye Adı:</strong> {memberData.membersName} <br />
                                            <strong>Üye Soyadı:</strong> {memberData.membersSurname} <br />
                                            <strong>Üye Yaşı:</strong> {memberData.membersAge} <br />
                                            <strong>Üye Cinsiyeti:</strong> {memberData.membersGender}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div2>

                        <div>
                            <mbutton2 onClick={() => setIsUpdateAccordionOpen(!isUpdateAccordionOpen)}>
                                {isUpdateAccordionOpen ? "Üye Güncellemeyi Gizle" : "Üye Güncelle"}
                            </mbutton2>
                            {isUpdateAccordionOpen && (
                                <div>
                                    <button className="button-28" onClick={() => setShowUpdatePopup(true)}>
                                        Üye Güncelle
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <mbutton2 onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
                                {isAccordionOpen ? "Üyeleri Gizle" : "Üyeleri Göster"}
                            </mbutton2>
                            {isAccordionOpen && (
                                <div className="box-container">
                                    {data.length > 0 ? (
                                        data.map((member) => (
                                            <div className="box" key={member.membersId}>
                                                <strong>Üye Id:</strong> {member.membersId} <br />
                                                <strong>Üye Adı:</strong> {member.membersName} <br />
                                                <strong>Üye Soyadı:</strong> {member.membersSurname} <br />
                                                <strong>Üye Yaşı:</strong> {member.membersAge} <br />
                                                <strong>Üye Cinsiyeti:</strong> {member.membersGender} <br />
                                                <div className="button-container">
                                                    <button className="button-28" role="button" onClick={() => deleteMember(member.membersId)}>
                                                        Sil
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>Hiç üye bulunamadı.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {showPopup && <AddMemberPopup />}
            {showUpdatePopup && <UpdateMemberPopup />}
            <ToastContainer />
        </>
    );
};

export default Members;
