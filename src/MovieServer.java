/*
* hjStreamServer.java 
* Streaming server: emitter of video streams (movies)
* Can send in unicast or multicast IP for client listeners
* that can play in real time the transmitted movies
*/

import java.io.*;
import java.net.*;

import utils.Utils;

public class MovieServer {
	
	public static final String IP = "127.0.0.1";
	public static final int PORT = 7777;

	static public void main( String []args ) throws Exception {
	             
		int size;
		int count = 0;
 		long time;
		DataInputStream g = new DataInputStream( new FileInputStream(Utils.MOVIE_PATH + "Test.mp4"));
		byte[] buff = new byte[70000];
		MulticastSocket s = new MulticastSocket();
		//DatagramSocket s = new DatagramSocket();
		InetSocketAddress addr = new InetSocketAddress( IP, PORT);
		DatagramPacket p = new DatagramPacket(buff, buff.length, addr );
		long t0 = System.nanoTime(); // tempo de referencia para este processo
		long q0 = 0;

		while ( g.available() > 0 ) {
			size = g.readUnsignedShort();
			time = g.readLong();
			if ( count == 0 ) q0 = time; // tempo de referencia no stream
			count += 1;
			g.readFully(buff, 0, size );
			p.setData(buff, 0, size );
			p.setSocketAddress( addr );
			long t = System.nanoTime();
			System.out.println("time -> " + time);
			System.out.println("q0 -> " + q0);
			System.out.println("t -> " + t);
			System.out.println("t0 -> " + t0);
			Thread.sleep(80);
			//Thread.sleep( Math.max(0, ((time-q0)-(t-t0))/1000000) );
			s.send( p );
			System.out.print( "." );
		}

		System.out.println("DONE! packets sent: "+count);
	}

}
