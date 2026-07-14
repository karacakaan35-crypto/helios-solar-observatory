# Helios — Etkileşimli Güneş Gözlemevi

Helios, Güneş Sistemi’ni sıkıştırılmış ölçekte Three.js ile canlandıran; Kepler yörüngeleri, seçilebilir gök cisimleri, ayarlanabilir zaman ve 19 Mayıs 2081 anma sahnesi içeren etkileşimli bir gözlemevidir.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Kullanım

- Gök cismi düğmeleriyle hedef seçin veya 3B sahnedeki bir gezegene dokunun.
- Sistem, İç, Dış ve Dünya düğmeleriyle kamera görünümünü değiştirin.
- Zamanı duraklatın, hızlandırın veya sıfırlayın.
- Yörünge, etiket ve referans ızgarası katmanlarını açıp kapatın.
- Klavyede `Boşluk` oynat/duraklat, `←/→` hız, `R` sıfırlama ve `F` odaklama işlevlerini çalıştırır.

Boyutlar ve uzaklıklar okunabilirlik için görsel olarak sıkıştırılmıştır. Yörünge süreleri, dışmerkezlik ve eğimler modellenir; çalışma bilimsel efemeris veya navigasyon aracı değildir. Uydu sayıları NASA’nın 2026 verileriyle güncellenmiştir.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the site and verify the rendered product shell

## Kaynaklar

- [NASA — Jupiter Moons](https://science.nasa.gov/jupiter/jupiter-moons/)
- [NASA — Saturn Moons](https://science.nasa.gov/saturn/moons/)
- [NASA — Uranus Moons](https://science.nasa.gov/uranus/moons/)
- [NASA — Neptune Moons](https://science.nasa.gov/neptune/moons/)
