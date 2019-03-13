<?php

namespace App\Http\Controllers;

use App\Office;
use App\Color;
use App\Design;
use App\Stock;
use App\Fabric;
use App\Product;
use App\Supplier;
use App\Customer;
use App\User;
use App\StockMovement;
use App\NotificationEvent;
use Illuminate\Http\Request;

class NotificationEventController extends Controller
{
    public function index()
    {
        return response()->json(NotificationEvent::all(),200);
    }
    
    public function subscribe(Request $request)
    {
        session_start();
        session_write_close();

        // disable default disconnect checks
        ignore_user_abort(true);

		// set headers for stream
        header("Content-Type: text/event-stream");
        header("Cache-Control: no-cache");
        header("Access-Control-Allow-Origin: *");

		// Is this a new stream or an existing one?
		$firstCheck = false;
		$lastEventId = isset($request->last_event_id) ? $request->last_event_id : NotificationEvent::max('id');

		echo ":" . str_repeat(" ", 2048) . "\n"; // 2 kB padding for IE
		echo "retry: 5000\n";

		// start stream
		while(true){

			if(connection_aborted()){
				exit();
			}

			else{
				// here you will want to get the latest event id you have created on the server, but for now we will increment and force an update
				$latestEventId = NotificationEvent::latest('id')->first();
				
				if(!isset($request->last_event_id) && !$firstCheck) {
					$firstCheck = true;
					$values = [
						'offices' => Office::all(),
						'colors' => Color::all(),
						'designs' => Design::all(),
						'fabrics' => Fabric::all(),
						'products' => Product::with(['fabric','color','design'])->get(),
						'customers' => Customer::all(),
						'suppliers' => Supplier::all(),
						'users' => User::with(['customer'])->get(),
						'stocks' => Stock::with(['office','product.fabric','product.color','product.design','stocks'])->get(),
						'stock_movements' => StockMovement::with(['office','to_office'])->get(),
						
					];
					echo "event: initValues\n";
					echo "id: " . $latestEventId->id . "\n";
					echo "data: ".json_encode($values)."\n\n";
					ob_flush();
                    flush();
				}

				if($lastEventId < $latestEventId->id){
					$events = NotificationEvent::with(['entity'])->where('id','>',$lastEventId)->get();
					echo "event: notification\n";
					echo "id: " . $latestEventId->id . "\n";
					echo "data: ".json_encode($events)."\n\n";
					$lastEventId = $latestEventId->id;
					ob_flush();
                    flush();
				}
				else{			
					// no new data to send
					echo ": heartbeat\n\n";
					ob_flush();
					flush();				
				}

			}
	
			// 5 second sleep then carry on
			sleep(5);

		}
    }
}
