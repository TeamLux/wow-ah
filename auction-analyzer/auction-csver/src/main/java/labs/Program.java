package labs;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;

/**
 *
 * @author Nicolas - TeamLux
 * @version 1.0.0
 */
public abstract class Program {
    private static final DateFormat DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy");
    private static final DateFormat TIME_FORMAT = new SimpleDateFormat("HH:mm:ss");
    private static final String LINE_SEP = System.getProperty("line.separator");

    public static void main(String[] args) throws FileNotFoundException {
        //2258948a184dc11ddc78b107afc423bd-1427586282000.json
        //http://www.wowhead.com/item=111557/sumptuous-fur

        analyseItem(111557, "/Users/kollektiv/Documents/wow-ah/09-04-2015/data", "111557.csv");
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
                    JSONObject jEnch;
                    long sumPrice = 0L, sumQte = 0L;
                    int lgt = jArray.length(), qteEnch = 0;
                    for(int j = 0 ; j < lgt ; j++){
                        jEnch = jArray.getJSONObject(j);
                        if(jEnch.getInt("item") != itemId)
                            continue;
                        sumPrice += jEnch.getInt("buyout");
                        sumQte += jEnch.getInt("quantity");
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

}
