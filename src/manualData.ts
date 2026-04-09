export interface ManualItem {
  id: string;
  title: string;
  content: string;
  category: 'Genel' | 'Film İşlemleri' | 'Raporlar' | 'Ayarlar' | 'AI & Teknik';
}

export const USER_MANUAL: ManualItem[] = [
  { id: '1', category: 'Genel', title: 'Uygulama Nedir?', content: 'Bu uygulama, seyrettiğiniz veya seyretmeyi planladığınız film ve dizileri takip etmenizi sağlayan kişisel bir arşiv sistemidir. Modern arayüzü ve akıllı özellikleriyle film tutkunları için tasarlanmıştır.' },
  { id: '2', category: 'Genel', title: 'Giriş ve Güvenlik', content: 'Uygulamaya e-posta ve şifrenizle giriş yapabilirsiniz. "Beni Hatırla" seçeneği ile her seferinde şifre girmekten kurtulabilirsiniz. Şifrenizi unutursanız "Şifremi Unuttum" butonuyla yardım alabilirsiniz.' },
  { id: '3', category: 'Genel', title: 'Dashboard Kullanımı', content: 'Dashboard, arşivinizin kalbidir. Toplam kayıt sayısı, seyredilenler, yaklaşan vizyonlar ve son aktiviteleriniz burada görselleştirilir. Kutucuklara tıklayarak film detaylarını görebilir ve düzenleyebilirsiniz.' },
  { id: '4', category: 'Genel', title: 'Çoklu Dil Desteği (Yeni)', content: 'Uygulamayı hem Türkçe hem de İngilizce olarak kullanabilirsiniz. Yan menüdeki dil butonuyla anında geçiş yapabilirsiniz.' },
  { id: '5', category: 'Genel', title: 'Tarih Formatı (Yeni)', content: 'Tüm sistemde tarihler "Gün.Ay.Yıl" (Örn: 09.04.2026) formatında gösterilir, bu da takibi kolaylaştırır.' },
  
  { id: '6', category: 'Film İşlemleri', title: 'Film veya Dizi İşle (Yeni)', content: 'Sekme ismi "Film veya Dizi İşle" olarak güncellendi. Seçiminize göre kaydet butonu "Film İşle" veya "Dizi İşle" olarak dinamik değişir.' },
  { id: '7', category: 'Film İşlemleri', title: 'Başlık Kopyalama (Yeni)', content: 'Türkçe Adı kısmına yazdığınız ismi, Orijinal Adı yanındaki butona basarak anında kopyalayabilirsiniz.' },
  { id: '8', category: 'Film İşlemleri', title: 'AI ile Otomatik Getir', content: 'Film adını yazıp Sparkles (yıldız) ikonuna bastığınızda, Gemini AI film özetini, oyuncuları, IMDb puanını ve fragman linkini otomatik olarak doldurur.' },
  { id: '9', category: 'Film İşlemleri', title: 'Manuel AI Ayrıştırıcı (Gelişmiş)', content: 'Dış AI araçlarından (ChatGPT vb.) aldığınız JSON sonucunu en alttaki alana yapıştırıp "Alanlara Ayrıştır" derseniz tüm form saniyeler içinde dolar. İşlem sonrası alan temizlenir.' },
  { id: '10', category: 'Film İşlemleri', title: 'Kiminle Seyrettim? Mantığı (Yeni)', content: '"Yalnız" seçeneği seçildiğinde diğer kişiler temizlenir. Diğer kişilerden biri seçildiğinde ise "Yalnız" seçeneği otomatik olarak kaldırılır.' },
  { id: '11', category: 'Film İşlemleri', title: 'Alan Sıralaması (Yeni)', content: 'Form alanları kullanım kolaylığı için; Oyuncular, Kategori, Kiminle Seyrettim, İzleme Tarihi, Puan ve Notlar şeklinde yeniden sıralandı.' },
  
  { id: '21', category: 'Raporlar', title: 'Toplu Silme Özelliği (Yeni)', content: 'Raporlar listesinde sol taraftaki kutucuklarla birden fazla kayıt seçip "Seçilenleri Sil" butonuyla toplu temizlik yapabilirsiniz.' },
  { id: '22', category: 'Raporlar', title: 'Mükerrer Kayıt Kontrolü (Gelişmiş)', content: 'Aynı isimle kaydedilmiş filmleri bulur. Mükerrer listesinde her kaydı ayrı ayrı düzenleyebilir veya silebilirsiniz.' },
  { id: '23', category: 'Raporlar', title: 'Gelişmiş Arama ve Filtreleme', content: 'Hem Türkçe hem de Orijinal ad üzerinden arama yapabilir, "Seyredilenler" veya "Gelecek" olarak filtreleyebilirsiniz.' },
  { id: '24', category: 'Raporlar', title: 'Excel ve E-posta Yedekleme', content: 'Listenizi Excel olarak indirebilir veya SMTP ayarlarınız yapılıysa e-posta ile kendinize yedek olarak gönderebilirsiniz.' },
  
  { id: '31', category: 'Ayarlar', title: 'Kategori ve Arkadaş Yönetimi', content: 'Kendi film türlerinizi ve izleme arkadaşlarınızı buradan ekleyip çıkarabilirsiniz.' },
  { id: '32', category: 'Ayarlar', title: 'SMTP ve API Ayarları', content: 'E-posta gönderimi için SMTP, AI özellikleri için Gemini API anahtarlarınızı buradan güvenle yönetebilirsiniz.' },
  { id: '33', category: 'Ayarlar', title: 'Veri Yönetimi', content: 'Tüm verilerinizi JSON olarak yedekleyebilir veya örnek veri yükleyerek sistemi test edebilirsiniz.' },
  
  { id: '41', category: 'AI & Teknik', title: 'Gemini AI Entegrasyonu', content: 'Uygulama, Google Gemini Pro modelini kullanarak film bilgilerini saniyeler içinde getirir.' },
  { id: '42', category: 'AI & Teknik', title: 'Yedekli API Sistemi', content: 'İki farklı API anahtarı girerek kotası dolan anahtar yerine diğerinin otomatik kullanılmasını sağlayabilirsiniz.' },
  { id: '43', category: 'AI & Teknik', title: 'Sistem Debug Kayıtları', content: 'Teknik bir sorun oluştuğunda Ayarlar altındaki debug kayıtlarından hatanın kaynağını görebilirsiniz.' }
];
