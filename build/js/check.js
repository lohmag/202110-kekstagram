/**
 * Created by nmass on 26.05.2016.
 */
function getMessage(a, b) {
    switch (typeof a) {
        case 'boolean':
            if (a === true) {
                return "���������� GIF-����������� ����������� � �������� " + b + " ������";
            } else if (a === false) {
                return "���������� GIF-����������� �� �����������";
            }
        case 'number':
            return "���������� SVG-����������� �������� " + a + " �������� � " + b * 4 + " ���������";
        case 'object':
            if (typeof b === 'object') {
                for (i = 0; i < a.length; i++) {
                    square += a[i] + b[i];
                }
                return "����� ������� ���������� ������: " + square + "��������"
            } else {
                for (i = 0; i < a.length; i++) {
                    sum += a[i];
                }
                return "���������� ������� ����� �� ���� �������� �����������: " + sum;
            }
    }

}