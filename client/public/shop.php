<?php
header("Content-Type: application/json; encoding=utf-8");

$secret_key = 'bXUoWUOsJtNnfAHPiu3U'; // Защищённый ключ приложения

$input = $_POST;

// Проверка подписи
$sig = $input['sig'];
unset($input['sig']);
ksort($input);
$str = '';
foreach ($input as $k => $v) {
  $str .= $k.'='.$v;
}

if ($sig != md5($str.$secret_key)) {
  $response['error'] = array(
    'error_code' => 10,
    'error_msg' => 'Несовпадение вычисленной и переданной подписи запроса.',
    'critical' => true
  );
} else {
  // Подпись правильная
  switch ($input['notification_type']) {
    case 'get_item':
      // Получение информации о товаре
      $item = $input['item']; // наименование товара

      if ($item == 'item1') {
        $response['response'] = array(
          'item_id' => 30,
          'title' => '30 подсказок',
          'photo_url' => 'https://footballcoin.ru/scince.png',
          'price' => 3
        );
    } elseif ($item == 'item2') {
        $response['response'] = array(
          'item_id' => 65,
          'title' => '65 подсказок',
          'photo_url' => 'https://footballcoin.ru/scince.png',
          'price' => 6
        );
    } elseif ($item == 'item3') {
        $response['response'] = array(
          'item_id' => 150,
          'title' => '150 подсказок',
          'photo_url' => 'https://footballcoin.ru/scince.png',
          'price' => 12
        );
    } elseif ($item == 'item4') {
        $response['response'] = array(
            'item_id' => 310,
            'title' => '310 подсказок',
            'photo_url' => 'https://footballcoin.ru/scince.png',
            'price' => 24
        );
    } elseif ($item == 'item5') {
        $response['response'] = array(
            'item_id' => 650,
            'title' => '920 подсказок',
            'photo_url' => 'https://footballcoin.ru/scince.png',
            'price' => 48
        );
    } elseif ($item == 'item6') {
        $response['response'] = array(
            'item_id' => 999,
            'title' => '999 подсказок',
            'photo_url' => 'https://footballcoin.ru/scince.png',
            'price' => 55
        );
     } else {
        $response['error'] = array(
          'error_code' => 20,
          'error_msg' => 'Товара не существует.',
          'critical' => true
        );
      }
      break;

    case 'get_item_test':
      // Получение информации о товаре в тестовом режиме
    $item = $input['item'];
    if ($item == 'item1') {
      $response['response'] = array(
        'item_id' => 30,
        'title' => '30 подсказок',
        'photo_url' => 'https://footballcoin.ru/scince.png',
        'price' => 3
      );
  } elseif ($item == 'item2') {
      $response['response'] = array(
        'item_id' => 65,
        'title' => '65 подсказок',
        'photo_url' => 'https://footballcoin.ru/scince.png',
        'price' => 6
      );
  } elseif ($item == 'item3') {
      $response['response'] = array(
        'item_id' => 150,
        'title' => '150 подсказок',
        'photo_url' => 'https://footballcoin.ru/scince.png',
        'price' => 12
      );
  } elseif ($item == 'item4') {
      $response['response'] = array(
          'item_id' => 310,
          'title' => '310 подсказок',
          'photo_url' => 'https://footballcoin.ru/scince.png',
          'price' => 24
      );
  } elseif ($item == 'item5') {
      $response['response'] = array(
          'item_id' => 650,
          'title' => '920 подсказок',
          'photo_url' => 'https://footballcoin.ru/scince.png',
          'price' => 48
      );
  } elseif ($item == 'item6') {
      $response['response'] = array(
          'item_id' => 999,
          'title' => '999 подсказок',
          'photo_url' => 'https://footballcoin.ru/scince.png',
          'price' => 55
      );
    } else {
        $response['error'] = array(
          'error_code' => 20,
          'error_msg' => 'Товара не существует.',
          'critical' => true
        );
      }
      break;

    case 'order_status_change':
      // Изменение статуса заказа
      if ($input['status'] == 'chargeable') {
        $order_id = intval($input['order_id']);
        $user_id = intval($input['user_id']);
        $item_id = intval($input['item_id']);

        // Код проверки товара, включая его стоимость
        $app_order_id = 1; // Получающийся у вас идентификатор заказа.

        $myCurl = curl_init();
        curl_setopt_array($myCurl, array(
        CURLOPT_URL => 'https://footballcoin.ru:2689/quiz/shop',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(array(
            'order_id' => $order_id,
            'app_order_id' => $app_order_id,
            'user_id' => $user_id,
            'item_id' => $item_id,
            'status' => 'chargeable'))
        ));
        $resp = curl_exec($myCurl);
        $resp = json_encode($resp);

        $response['response'] = array(
        'order_id' => $order_id,
        'app_order_id' => $app_order_id,
        );

        curl_close($myCurl);

        
      } else {
        $response['error'] = array(
          'error_code' => 100,
          'error_msg' => 'Передано непонятно что вместо chargeable.',
          'critical' => true
        );
      }
      break;

    case 'order_status_change_test':
      // Изменение статуса заказа в тестовом режиме
      if ($input['status'] == 'chargeable') {
        $order_id = intval($input['order_id']);
        $user_id = intval($input['user_id']);
        $item_id = intval($input['item_id']);

        $app_order_id = 1; // Тут фактического заказа может не быть - тестовый режим.

            $myCurl = curl_init();
            curl_setopt_array($myCurl, array(
            CURLOPT_URL => 'https://footballcoin.ru:2689/quiz/shop',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query(array(
                'order_id' => $order_id,
                'app_order_id' => $app_order_id,
                'user_id' => $user_id,
                'item_id' => $item_id,
                'status' => 'chargeable'))
            ));
            $resp = curl_exec($myCurl);
            $resp = json_encode($resp);

            $response['response'] = array(
            'order_id' => $order_id,
            'app_order_id' => $app_order_id,
            );

            curl_close($myCurl);
      } else {

        $myCurl = curl_init();
            curl_setopt_array($myCurl, array(
            CURLOPT_URL => 'https://footballcoin.ru:2689/quiz/shop',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query(array(
                'order_id' => $order_id,
                'app_order_id' => $app_order_id,
                'user_id' => $user_id,
                'item_id' => $item_id,
                'status' => 'chargeable'))
            ));
            $response = curl_exec($myCurl);

        $response['error'] = array(
          'error_code' => 100,
          'error_msg' => 'Передано непонятно что вместо chargeable.',
          'critical' => true
        );
      }
      break;
  }
}

echo json_encode($response);
?>