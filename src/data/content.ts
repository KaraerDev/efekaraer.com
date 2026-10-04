export const profile = {
  name: 'Efe Karaer',
  handle: 'SANSARSALVO55',
  email: 'efekaraer00@gmail.com',
  archiveDate: '03.10.2026',
};

export const links = [
  { name: 'MetaTFT', category: '01 / TFT', description: 'TFT kaydı.', url: 'https://www.metatft.com/player/tr/SANSARSALVO55-DEL%C4%B0', short: 'TFT profili' },
  { name: 'OP.GG', category: '02 / LEAGUE OF LEGENDS', description: 'Maç geçmişi.', url: 'https://op.gg/lol/summoners/tr/SANSARSALVO55-DEL%C4%B0', short: 'LoL profili' },
  { name: 'Spotify', category: '03 / FON MÜZİĞİ', description: 'Sade. Paradise.', url: 'https://open.spotify.com/user/11145638018?si=6Cn7l12bRzivJ0KYelxjyQ', short: 'Spotify profili' },
  { name: 'LinkedIn', category: '04 / LINKEDIN', description: 'İş tarafı.', url: 'https://www.linkedin.com/in/efekaraer', short: 'LinkedIn profili' },
  { name: 'E-posta', category: '05 / REKLAM & İŞBİRLİĞİ', description: 'Reklam ve işbirliği.', url: 'mailto:efekaraer00@gmail.com', short: 'efekaraer00@gmail.com' },
];

export type Exhibit = { id: number; image: string; title: string; alt: string; category: 'Portre' | 'Meme' | 'Paralel evren'; note: string };

export const exhibits: Exhibit[] = [
  { id: 1, image: 'karaer-16', title: 'Jahrein Karaer', alt: 'Sınıfta sıraya oturmuş kişinin üstüne yerleştirilmiş okul şakası', category: 'Paralel evren', note: 'Derslik.' },
  { id: 2, image: 'karaer-13', title: 'Kefen Karaer', alt: 'Beyaz örtünün içinden görünen yüzün yakın plan fotoğrafı', category: 'Meme', note: 'Yorum yok.' },
  { id: 3, image: 'karaer-11', title: '3LOT3RR0IST', alt: 'Üzerinde Arapça yazı bulunan filtreli yakın plan portre', category: 'Portre', note: 'Birinci versiyon.' },
  { id: 4, image: 'karaer-10', title: '3LOT3RR0IST', alt: 'Üzerinde İbranice yazı bulunan yeşil ve siyah tonlu portre', category: 'Portre', note: 'İkinci versiyon.' },
  { id: 5, image: 'karaer-9', title: 'Çakma Mühendis Karaer', alt: 'Gece çekilmiş, baret takan Efe’nin siyah beyaz portresi', category: 'Portre', note: 'Baret tamam.' },
  { id: 6, image: 'karaer-8', title: 'Anafen Karaer', alt: 'Renkli baskılı beyaz tişört giyen çocuğun düşük çözünürlüklü fotoğrafı', category: 'Paralel evren', note: 'Orijinal çözünürlük.' },
  { id: 7, image: 'karaer-7', title: 'Çakma Mühendis Karaer v2', alt: 'Birden fazla bilgisayar ekranının önünde çalışan kişi', category: 'Portre', note: 'v2.' },
  { id: 8, image: 'karaer-4', title: 'Çeçen Karaer', alt: 'Karanlıkta çekilmiş, sakallı Efe’nin yakın plan özçekimi', category: 'Portre', note: 'Karanlık.' },
  { id: 9, image: 'karaer-5', title: 'Mohikan Karaer', alt: 'Saçının ortasında küçük bir tutam bırakılmış Efe’nin portresi', category: 'Portre', note: 'Yeterli.' },
  { id: 10, image: 'karaer-18', title: 'Yakup TV Karaer', alt: 'Kulaklık takan kişinin görüntüsü ve altında sosyal medya yorumu', category: 'Paralel evren', note: 'Yorum ektedir.' },
  { id: 11, image: 'karaer-20', title: 'Babaanne Karaer', alt: 'Bir binaya yansıtılan yüz fotoğrafıyla ilgili sosyal medya paylaşımı', category: 'Meme', note: 'Cepheye sığmış.' },
  { id: 12, image: 'karaer-21', title: 'Akide Sugar Karaer', alt: 'Efe’nin yüzünün eklendiği, pazarda duran oyun karakteri', category: 'Paralel evren', note: 'Oyun içi.' },
  { id: 13, image: 'karaer-15', title: 'Nevada Karaer', alt: 'Üç kişinin gece fotoğrafı üzerine yazılmış kafe şakası', category: 'Meme', note: 'Nevada.' },
  { id: 14, image: 'karaer-17', title: 'İtici Karaer', alt: 'Siyah tişörtlü Efe’nin portresine eklenmiş sosyal medya yorumu', category: 'Meme', note: 'Yorum alınmıştır.' },
  { id: 15, image: 'karaer-6', title: 'hmm nt happen', alt: 'Kısa cevaplardan oluşan WhatsApp konuşmasının ekran görüntüsü', category: 'Meme', note: 'Cevap verilmiş.' },
];

export const stats = [
  { label: 'Mepple Enjoyer', value: 31, annotation: 'Orijinal yazım.' },
  { label: 'Messi Sevgisi', value: 100, annotation: 'Üst sınır.' },
  { label: 'Zeitnot', value: 99, annotation: 'Süre doldu.' },
];
