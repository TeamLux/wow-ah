package labs;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Scanner;
import java.util.function.Function;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * 
 * @author Nicolas - TeamLux
 * @version 1.0.0
 */
public abstract class Program {
	private static final DateFormat DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy");
	private static final DateFormat TIME_FORMAT = new SimpleDateFormat("HH:mm:ss");
	private static final String LINE_SEP = System.getProperty("line.separator");

	private static final HashMap<Integer, Long> hmItemID_QteJour = new HashMap<Integer, Long>();
	private static final HashMap<Auction, Integer> hmDump = new HashMap<Auction, Integer>();
	private static final HashSet<Integer> hsAuctionParsed = new HashSet<Integer>();
	
	public static void main(String[] args) throws IOException {
		//2258948a184dc11ddc78b107afc423bd-1427586282000.json
		//http://www.wowhead.com/item=111557/sumptuous-fur

		//analyseItem(111557, "data", "111557.csv");
		
		analyseDir(
				// Première lambda : return true / false selon si l'auction parsée doit être traitée par la fonction suivante
				(aucti) -> {
					if(hsAuctionParsed.contains(aucti.auc))
						return false;
					return true;
				},
				// Deuxième lambda : exécute qqch sur l'auction
				(aucti) ->{
					Long qte = hmItemID_QteJour.get(aucti.item); 
					if(qte == null)
						hmItemID_QteJour.put(aucti.item, 1L);
					else
						hmItemID_QteJour.put(aucti.item, qte + 1);
					hmDump.put(aucti, aucti.item);
					hsAuctionParsed.add(aucti.auc);
					return null;
				}, 
				// directorty à chercher
				"data");
		
		/*/try(PrintWriter pw = new PrintWriter(new File("mostused.csv"))){
			Long value;
			pw.append("itemId ;Nbr enchères;" + LINE_SEP);
			for(Integer itemId : hmItemID_QteJour.keySet()){
				value = hmItemID_QteJour.get(itemId);
				if(value > 100){
					pw.append(itemId.toString()).append(';');
					pw.append(value.toString()).append(';').append(LINE_SEP);
					pw.flush();
				}
			}
		}/**/
		/*/try(ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(new File("dump Hashmap Auction-itemId.javaObject")))){
			oos.writeObject(hmDump);
			oos.flush();
		}/**/

	}
	
	public static int analyseDir(Function<Auction, Boolean> fctCondition, Function<Auction, Void> fctAction, String directoryPath) throws FileNotFoundException{
		File dir = new File(directoryPath);
		if(! dir.exists())
			throw new FileNotFoundException(directoryPath);
		if(! dir.isDirectory())
			throw new FileNotFoundException(directoryPath + " n'est pas un dossier.");
		
		// On retrouve les fichiers
		File[] files = dir.listFiles((File dirToFilter, String filename) -> filename.endsWith(".json"));
		
		// On setup le multi-thread
		int nbrCore = Runtime.getRuntime().availableProcessors();
		Thread[] tPool = new Thread[(nbrCore <= 2) ? 1 : nbrCore - 1]; // => un ou deux coeur = 1 Thread, sinon q(core) - 1
		boolean filePicked;
		for(int i = 0 ; i < files.length ; i++){
			System.out.println("Parsing file n°" + (i+1) + " auf " + files.length);
			File f = files[i];
			filePicked = false;
			
			// On créé les instructions
			Runnable run = () -> {
				try(Scanner sc = new Scanner(new BufferedInputStream(new FileInputStream(f)))){
					JSONArray jArray = new JSONObject(sc.nextLine())
						.getJSONObject("auctions")
						.getJSONArray("auctions");
					
					Auction jObjActuel;
					int arrLgt = jArray.length();
					for(int j = 0 ; j < arrLgt ; j++){
						jObjActuel = new Auction(jArray.getJSONObject(j));
						if(fctCondition.apply(jObjActuel))
							fctAction.apply(jObjActuel);
						
					}
				}/**/ catch (Exception e){
					System.err.println(e.getMessage() + " @ " + f.getName());
				}/**/
			};
			
			// On assigne les instructions à un thread
			while(! filePicked) {
				
				for(int ibis = 0 ; ibis < tPool.length ; ibis++){
					if(tPool[ibis] == null || !tPool[ibis].isAlive()){
						tPool[ibis] = new Thread(run);
						tPool[ibis].setName(f.getName());
						tPool[ibis].start();
						filePicked = true;
						break;
					}
				}
				
				if(! filePicked)
					try {
						Thread.sleep(150);
					} catch (InterruptedException e) { }
			}
			
			//  On passe au suivant
		}
		return files.length;
	}
	
	public static void analyseItem(int itemId, String directoryPath, String junckerPath) throws FileNotFoundException{
		File dir = new File(directoryPath);
		if(! dir.exists())
			throw new FileNotFoundException(directoryPath);
		if(! dir.isDirectory())
			throw new FileNotFoundException(directoryPath + " n'est pas un dossier.");
		
		try(PrintWriter pw = new PrintWriter(new File(junckerPath))){
			File[] files = dir.listFiles((File dirToFilter, String filename) -> filename.endsWith(".json"));
			String timestampStr;
			StringBuilder sbRow;
			long timestampVal;
			Date timestampDat;

			pw.write("date;time;average price;quantity available;auction count;" + LINE_SEP);
			pw.flush();
			for(int i = 0 ; i < files.length ; i++){
				System.out.println("File n°" + (i + 1) + "/" + files.length);
				try {
					timestampStr = files[i].getName().substring(files[i].getName().lastIndexOf('-') + 1, files[i].getName().lastIndexOf('.'));
					timestampVal = Long.parseLong(timestampStr);
					timestampDat = new Date(timestampVal);
				} catch (Exception e) {
					continue;
				}
				
				try(Scanner sc = new Scanner(new BufferedInputStream(new FileInputStream(files[i])))){
					JSONArray jArray = new JSONObject(sc.nextLine())
						.getJSONObject("auctions")
						.getJSONArray("auctions");
					Auction jEnch;
					long sumPrice = 0L, sumQte = 0L;
					int lgt = jArray.length(), qteEnch = 0;
					for(int j = 0 ; j < lgt ; j++){
						jEnch = new Auction(jArray.getJSONObject(j));
						if(jEnch.item != itemId)
							continue;
						sumPrice += jEnch.buyout;
						sumQte += jEnch.quantity;
						qteEnch++;
					}
					if(sumQte == 0){
						sbRow = new StringBuilder();
						sbRow.append(DATE_FORMAT.format(timestampDat)).append(';');	//DATE
						sbRow.append(TIME_FORMAT.format(timestampDat)).append(';');	//TIME
						sbRow.append("0;0;0;" + LINE_SEP);							//AVER QTE COUNT
						pw.write(sbRow.toString());									//FLUSH TO FILE
						//System.out.print(sbRow.toString());
					} else {
						sbRow = new StringBuilder();
						sbRow.append(DATE_FORMAT.format(timestampDat)).append(';');	//DATE
						sbRow.append(TIME_FORMAT.format(timestampDat)).append(';');	//TIME
						sbRow.append(sumPrice / sumQte).append(';');				//AVERAGE
						sbRow.append(sumQte).append(';');							//QTE
						sbRow.append(qteEnch).append(";" + LINE_SEP);				//COUNT
						pw.write(sbRow.toString());									//FLUSH TO FILE
						//System.out.print(sbRow.toString());
					}
				} catch (Exception e){
					System.err.println(e.getMessage() + " @ " + files[i].getName());
				}
			}
		}
		
	}

	@SuppressWarnings("unused")
	private static class Auction implements Serializable{
		private static final long serialVersionUID = 1L;

		private transient JSONObject jObj;
		
		public final Integer auc;
		public final Integer item;
		public final String owner;
		public final String ownerRealm;
		public final Integer bid;
		public final Integer buyout;
		public final Integer quantity;
		public final String timeleft;
		public final Integer rand;
		public final Integer seed;
		public final Integer context;
		

		
		public Auction(JSONObject _jObj){
			jObj = _jObj;

			auc = jObj.getInt("auc");
			item = jObj.getInt("item");
			owner = jObj.getString("owner");
			ownerRealm = jObj.getString("ownerRealm");
			bid = jObj.getInt("bid");
			buyout = jObj.getInt("buyout");
			quantity = jObj.getInt("quantity");
			timeleft = jObj.getString("timeLeft");
			rand = jObj.getInt("rand");
			seed = jObj.getInt("seed");
			context = jObj.getInt("context");
			
			jObj = null;
		}

	}
}
