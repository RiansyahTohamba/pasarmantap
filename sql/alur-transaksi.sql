delete  from invoice_statuses;
delete  from invoices;
delete  from invoice_produks;

-- ceckout belanjaan -> konfirmasi pembayaran -> verifikasi oleh admin pasarmantap -> konfirmasi pesanan oleh penjual
-- -> konfirmasi pengiriman oleh penjual -> konfirmasi penerimaan oleh pembeli 

-- ceckout belanjaan
INSERT INTO `Invoices` (`id`,`kode`,`total_berat`,`ongkos_kirim`,`total_harga`,`keterangan`,`tanggal`,`jatuh_tempo`,`status_tampil`,`PenerimaId`,`TokoId`,`pembeliId`) 
	VALUES ('INV14660352354896648','INV/1466035235489/6648','700','2000','552000','-','2016-06-16 00:00:00','2016-06-19 00:00:00',0,'1','2',1);
INSERT INTO `Invoices` (`id`,`kode`,`total_berat`,`ongkos_kirim`,`total_harga`,`keterangan`,`tanggal`,`jatuh_tempo`,`status_tampil`,`PenerimaId`,`TokoId`,`pembeliId`) 
	VALUES ('INV14660352354895861','INV/1466035235489/5861','400','2000','4902000','-','2016-06-16 00:00:00','2016-06-19 00:00:00',0,'1','4',1);
INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354896648',0,'2016-06-16 00:00:00');
INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354895861',0,'2016-06-16 00:00:00');
INSERT INTO invoice_produks (invoiceId,produkId,jumlah_produk)VALUES('INV14660352354896648',24,1);
INSERT INTO invoice_produks (invoiceId,produkId,jumlah_produk)VALUES('INV14660352354895861',34,1);

-- konfirmasi pembayaran 
	-- invoice 1
	UPDATE `Invoices` SET `tanggal_pembayaran`='2016-06-16 00:00:00',`no_rekening`='92039339',
		`nama_pemilik_rekening`='riansyah',`status_tampil`=1, `jatuh_tempo`='2016-06-19 00:00:00'
		WHERE `id` = 'INV14660352354895861';
	INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354895861',1,'2016-06-16 00:05:00');
	-- invoice 2, error
	UPDATE `Invoices` SET `tanggal_pembayaran`='2016-06-17 00:00:00',`no_rekening`='2838393',`jatuh_tempo`='2016-06-19 00:00:00',
		`nama_pemilik_rekening`='riansyah',`status_tampil`=1 
		WHERE `id` = 'INV14660352354896648';
	INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354896648',1,'2016-06-16 00:07:00');

-- verifikasi oleh admin pasarmantap 
	-- invoice 1
	UPDATE `Invoices` SET `status_tampil`=2,`jatuh_tempo`='2016-06-19 00:00:00' WHERE `id` = 'INV14660352354895861';
	INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354895861',2,'2016-06-16 00:13:00');
	-- invoice 2
	UPDATE `Invoices` SET `status_tampil`=2,`jatuh_tempo`='2016-06-19 00:00:00' WHERE `id` = 'INV14660352354896648';
	INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354896648',2,'2016-06-16 00:13:00');

-- konfirmasi pesanan oleh penjual
	-- invoice 1
	UPDATE `Invoices` SET `status_tampil`=3,`jatuh_tempo`='2016-06-19 00:00:00' WHERE `id` = 'INV14660352354895861';
	INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354895861',3,'2016-06-16 00:19:00');
	-- invoice 2
	UPDATE `Invoices` SET `status_tampil`=3,`jatuh_tempo`='2016-06-19 00:00:00' WHERE `id` = 'INV14660352354896648';
	INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354896648',3,'2016-06-16 00:17:00');

-- konfirmasi pengiriman oleh penjual
	-- invoice 1
		UPDATE `Invoices` SET `status_tampil`=4,`no_resi`='8383938392',`jatuh_tempo`='2016-06-19 00:00:00' WHERE `id` = 'INV14660352354895861';
		INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354895861',4,'2016-06-16 08:30:00');
	-- invoice 2
		UPDATE `Invoices` SET `status_tampil`=4,`no_resi`='83839312392',`jatuh_tempo`='2016-06-19 00:00:00' WHERE `id` = 'INV14660352354896648';
		INSERT INTO `Invoice_Statuses` (`invoiceId`,`statusId`,`waktu`) VALUES ('INV14660352354896648',4,'2016-06-16 08:30:00');

-- konfirmasi penerimaan oleh pembeli?

