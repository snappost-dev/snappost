# Known Issues & Future Fixes

## Güvenlik

### [MEDIUM] Aynı tarayıcıda çoklu hesap cookie çakışması
- **Durum:** Açık
- **Açıklama:** Aynı tarayıcıda iki farklı Snappost hesabı açıkken, A hesabına ait bir subdomain dashboard'unu B hesabından açmaya çalışınca A'nın cookie'si geçerli olduğu için A'nın dashboard'u açılıyor.
- **Sebep:** Subdomain bazlı cookie izolasyonu yok, auth cookie'ler karışıyor.
- **Çözüm:** Server-side session yönetimi (cookie -> session ID, KV'de session store)
- **Öncelik:** Düşük (gerçek kullanımda nadir senaryo)

## Notlar
Bu dosya pivot sürecinde tespit edilen bilinen sorunları içerir.
Çözümler ilerleyen sprintlerde ele alınacaktır.
