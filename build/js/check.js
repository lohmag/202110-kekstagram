/**
 * Created by nmass on 26.05.2016.
 */
function getMessage(a, b) {
    switch (typeof a) {
        case 'boolean':
            if (a === true) {
                return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
            } else if (a === false) {
                return "Переданное GIF-изображение не анимировано";
            }
        case 'number':
            return "Переданное SVG-изображение содержит " + a + " объектов и " + b * 4 + " атрибутов";
        case 'object':
            if (typeof b === 'object') {
                for (i = 0; i < a.length; i++) {
                    square += a[i] + b[i];
                }
                return "Общая площадь артефактов сжатия: " + square + "пикселей"
            } else {
                for (i = 0; i < a.length; i++) {
                    sum += a[i];
                }
                return "Количество красных точек во всех строчках изображения: " + sum;
            }
    }

}