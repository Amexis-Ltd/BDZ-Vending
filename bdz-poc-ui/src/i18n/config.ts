import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
const resources = {
  bg: {
    translation: {
      welcome: {
        title: 'Билетен терминал',
        selectLanguage: 'Моля, изберете език',
      },
      menu: {
        title: 'Билетен терминал',
        buyTicket: 'Купи билет',
        schedule: 'Разписание',
        help: 'Помощ',
        accessibility: 'Достъпност',
        language: 'Език',
      },
      ticketSelection: {
        title: 'Изберете тип билет',
        back: 'Назад',
        cancel: 'Отказ',
        step: 'Стъпка {{current}} от {{total}}',
        types: {
          oneWay: {
            title: 'Еднопосочен билет',
            description: 'Билет за пътуване в една посока'
          },
          return: {
            title: 'Двупосочен билет',
            description: 'Билет за пътуване в двете посоки'
          },
          season: {
            title: 'Абонаментна карта',
            description: 'Карта за многократно пътуване'
          },
          group: {
            title: 'Групов билет',
            description: 'Билет за група пътници'
          }
        },
        destination: {
          title: 'Изберете дестинация',
          back: 'Назад',
          cancel: 'Отказ',
          continue: 'Продължи',
          step: 'Стъпка {{current}} от {{total}}',
          from: 'От:',
          to: 'До:',
          useLocation: 'Използвай текущата локация',
          swapStations: 'Размени гарите',
          searchPlaceholder: 'Търсене на гара...',
          popularStations: 'Популярни гари',
          validation: {
            sameStation: 'Началната и крайната гара не могат да бъдат еднакви',
            required: 'Моля, изберете начална и крайна гара'
          },
          location: {
            loading: 'Зареждане на локацията...',
            notImplemented: 'Функцията за автоматично определяне на най-близката гара е в разработка',
            error: 'Грешка при определяне на локацията',
            permissionDenied: 'Достъпът до локацията е отказан. Моля, разрешете достъпа в настройките на браузъра',
            unavailable: 'Локацията не е достъпна в момента',
            timeout: 'Времето за определяне на локацията изтече',
            notSupported: 'Вашият браузър не поддържа определяне на локация'
          }
        },
        train: {
          title: 'Изберете влак',
          back: 'Назад',
          cancel: 'Отказ',
          step: 'Стъпка {{current}} от {{total}}',
        },
      },
      accessibility: {
        title: 'Настройки за Достъпност',
        fontSize: 'Размер на шрифта',
        highContrast: 'Висок контраст',
        highContrastDescription: 'Включва режим с висок контраст',
        theme: 'Тема',
        darkTheme: 'Тъмна тема',
        lightTheme: 'Светла тема',
      },
      help: {
        tooltip: 'Помощ',
        ariaLabel: 'Отвори помощ',
        steps: 'Стъпки:',
        menuTitle: 'Как да използвате менюто',
        menuContent: 'Това е главното меню на БДЖ Вендинг Автомат. От тук можете да изберете различни услуги като закупуване на билети, преглед на разписания или достъп до помощ.',
        menuStep1: 'Изберете "Купи билет" за закупуване на железопътен билет',
        menuStep2: 'Изберете "Разписание" за преглед на разписанията на влаковете',
        menuStep3: 'Изберете "Помощ" за допълнителна информация',
        menuStep4: 'Използвайте бутоните за настройки в долната част на екрана за достъп до езикови настройки и настройки за Достъпност',
      },
      common: {
        continue: 'Продължи',
        close: 'Затвори',
      },
      dateTimeSelection: {
        title: 'Изберете дата и време',
        back: 'Назад',
        cancel: 'Отказ',
        continue: 'Продължи',
        step: 'Стъпка {{current}} от {{total}}',
        date: {
          label: 'Дата на пътуване',
          placeholder: 'Изберете дата',
          minDateError: 'Датата не може да бъде в миналото',
          maxDateError: 'Датата не може да бъде след 30 дни'
        },
        timeRange: {
          label: 'Предпочитан часови диапазон',
          morning: 'Сутрин (6:00-12:00)',
          afternoon: 'Обед (12:00-18:00)',
          evening: 'Вечер (18:00-24:00)',
          night: 'Нощ (0:00-6:00)',
          all: 'Всички часове'
        },
        filters: {
          title: 'Допълнителни филтри',
          expand: 'Покажи филтри',
          collapse: 'Скрий филтри',
          directTrains: 'Само директни влакове',
          seatReservation: 'Само с места за резервация',
          maxTransferTime: 'Максимално време за прекачване',
          trainType: {
            label: 'Тип влак',
            all: 'Всички влакове',
            fast: 'Бърз влак (БВ)',
            passenger: 'Пътнически (ПВ)',
            express: 'Експрес (ЕКС)'
          }
        }
      }
    },
  },
  en: {
    translation: {
      welcome: {
        title: 'Ticket Terminal',
        selectLanguage: 'Please select a language',
      },
      menu: {
        title: 'Ticket Terminal',
        buyTicket: 'Buy Ticket',
        schedule: 'Schedule',
        help: 'Help',
        accessibility: 'Accessibility',
        language: 'Language',
      },
      ticketSelection: {
        title: 'Select ticket type',
        back: 'Back',
        cancel: 'Cancel',
        step: 'Step {{current}} of {{total}}',
        types: {
          oneWay: {
            title: 'One-way ticket',
            description: 'Ticket for one-way travel'
          },
          return: {
            title: 'Return ticket',
            description: 'Ticket for return travel'
          },
          season: {
            title: 'Season ticket',
            description: 'Ticket for multiple journeys'
          },
          group: {
            title: 'Group ticket',
            description: 'Ticket for a group of passengers'
          }
        },
        destination: {
          title: 'Select destination',
          back: 'Back',
          cancel: 'Cancel',
          continue: 'Continue',
          step: 'Step {{current}} of {{total}}',
          from: 'From:',
          to: 'To:',
          useLocation: 'Use current location',
          swapStations: 'Swap stations',
          searchPlaceholder: 'Search for a station...',
          popularStations: 'Popular stations',
          validation: {
            sameStation: 'Origin and destination stations cannot be the same',
            required: 'Please select both origin and destination stations'
          },
          location: {
            loading: 'Loading location...',
            notImplemented: 'Automatic nearest station detection is under development',
            error: 'Error getting location',
            permissionDenied: 'Location access denied. Please enable location access in your browser settings',
            unavailable: 'Location is currently unavailable',
            timeout: 'Location request timed out',
            notSupported: 'Your browser does not support location services'
          }
        },
        train: {
          title: 'Select Train',
          back: 'Back',
          cancel: 'Cancel',
          step: 'Step {{current}} of {{total}}',
        },
      },
      accessibility: {
        title: 'Accessibility Settings',
        fontSize: 'Font Size',
        highContrast: 'High Contrast',
        highContrastDescription: 'Enable high contrast mode',
        theme: 'Theme',
        darkTheme: 'Dark Theme',
        lightTheme: 'Light Theme',
      },
      help: {
        tooltip: 'Help',
        ariaLabel: 'Open help',
        steps: 'Steps:',
        menuTitle: 'How to Use the Menu',
        menuContent: 'This is the main menu of the BDZ Vending Machine. From here you can select various services such as purchasing tickets, viewing schedules, or accessing help.',
        menuStep1: 'Select "Buy Ticket" to purchase a train ticket',
        menuStep2: 'Select "Schedule" to view train timetables',
        menuStep3: 'Select "Help" for additional information',
        menuStep4: 'Use the settings buttons at the bottom of the screen to access language and accessibility settings',
      },
      common: {
        continue: 'Continue',
        close: 'Close',
      },
      dateTimeSelection: {
        title: 'Select Date and Time',
        back: 'Back',
        cancel: 'Cancel',
        continue: 'Continue',
        step: 'Step {{current}} of {{total}}',
        date: {
          label: 'Travel Date',
          placeholder: 'Select date',
          minDateError: 'Date cannot be in the past',
          maxDateError: 'Date cannot be more than 30 days in the future'
        },
        timeRange: {
          label: 'Preferred Time Range',
          morning: 'Morning (6:00-12:00)',
          afternoon: 'Afternoon (12:00-18:00)',
          evening: 'Evening (18:00-24:00)',
          night: 'Night (0:00-6:00)',
          all: 'All hours'
        },
        filters: {
          title: 'Additional Filters',
          expand: 'Show filters',
          collapse: 'Hide filters',
          directTrains: 'Direct trains only',
          seatReservation: 'Only with seat reservation',
          maxTransferTime: 'Maximum transfer time',
          trainType: {
            label: 'Train Type',
            all: 'All trains',
            fast: 'Fast train (FT)',
            passenger: 'Passenger train (PT)',
            express: 'Express train (ET)'
          }
        }
      }
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'bg',
    lng: 'bg',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    supportedLngs: ['bg', 'en'],
  });

export default i18n; 