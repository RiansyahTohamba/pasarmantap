<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class ongkir extends CI_Controller {
    function __construct() {
        parent::__construct();
        $this->load->model('m_ongkir');
    }

    public function testApi() {
      $kabupatenId = $this->uri->segment(3);
      echo $this->m_ongkir->getCost($kabupatenId,800);
    }
    public function getCostOKE() {
      $kabupatenId = $this->uri->segment(4);
      $berat = $this->uri->segment(3); //dalam gram
      $cost = json_decode($this->m_ongkir->getCost($kabupatenId,$berat) ,true);
      if(!$cost)
        echo '404'; //tidak terkoneksi internet
      else if ( isset($cost['rajaongkir']['results'][0]['costs'][0]) =='' )
        echo '405'; //daerah tidak terjangkau JNE
      else
        echo $cost['rajaongkir']['results'][0]['costs'][0]['cost'][0]['value'];
    }
    public function getCostYES() {
      $kabupatenId = $this->uri->segment(4);
      $berat = $this->uri->segment(3); //dalam gram
      $cost = json_decode($this->m_ongkir->getCost($kabupatenId,$berat) ,true);
      if(!$cost)
        echo '404'; //tidak terkoneksi internet
      else if ( isset($cost['rajaongkir']['results'][0]['costs'][0]) =='' )
        echo '405'; //daerah tidak terjangkau JNE
      else
        echo $cost['rajaongkir']['results'][0]['costs'][2]['cost'][0]['value'];
    }
    public function getCostREG() {
      $kabupatenId = $this->uri->segment(4);
      $berat = $this->uri->segment(3); //dalam gram
      $cost = json_decode($this->m_ongkir->getCost($kabupatenId,$berat) ,true);
      if(!$cost)
        echo '404'; //tidak terkoneksi internet
      else if ( isset($cost['rajaongkir']['results'][0]['costs'][0]) =='' )
        echo '405'; //daerah tidak terjangkau JNE
      else
        echo $cost['rajaongkir']['results'][0]['costs'][1]['cost'][0]['value'];

    }





}
